import './App.css';
import TemplateTopBar from './components/TemplateTopBar';
import BeefreeEditor from './components/BeefreeEditor';
import BeeConfigSidebar from './components/BeeConfigSidebar';
import ExportDropdown from './components/ExportDropdown';
import HtmlImportModal from './components/HtmlImportModal';
import ExportResultModal from './components/ExportResultModal';
import { useState, useEffect } from 'react';
import type { TemplateData, BeefreeTemplateJson, BeefreeConfig } from './types';
import type { WindowWithBeefreeFunctions } from './types/window';
import {
  loadTemplateHtml,
  loadTemplatePlainText,
  getTemplatePdfUrl,
  getTemplateImageUrl,
  loadTemplate
} from './services/localTemplates';

/**
 * Main Application Component
 * 
 * This is the root component that orchestrates:
 * - Template selection and loading
 * - Beefree SDK editor initialization
 * - BeeConfig management
 * - Export functionality (HTML, PDF, Image, Plain Text)
 * - HTML import functionality
 * - Custom CSS toggle
 */
function App() {
  // Template state
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateData | null>(null); // Currently selected template from catalog
  const [beeConfig, setBeeConfig] = useState<BeefreeConfig | null>(null); // Current Beefree SDK configuration
  
  // Export modal states
  const [exportModalOpen, setExportModalOpen] = useState(false); // Controls export modal visibility
  const [exportType, setExportType] = useState<'html' | 'plain-text' | 'pdf' | 'image' | null>(null); // Type of export being performed
  const [exportContent, setExportContent] = useState<string>(''); // Exported HTML or plain text content
  const [exportImageUrl, setExportImageUrl] = useState<string>(''); // Blob URL for exported image
  const [exportPdfUrl, setExportPdfUrl] = useState<string>(''); // URL for exported PDF
  const [exportLoading, setExportLoading] = useState(false); // Loading state for export operations
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({}); // Loading states for different operations
  const [error, setError] = useState<string>(''); // Global error message
  
  // Import modal state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false); // Controls HTML import modal visibility

  /**
   * Auto-select the initial template on app load
   */
  useEffect(() => {
    const loadInitialTemplate = async () => {
      try {
        const initialTemplateId = 'beefree-sdk-demo-template';
        const templateData = await loadTemplate(initialTemplateId);

        // Set the template as selected
        setSelectedTemplate({
          id: templateData.id,
          name: templateData.name,
          display_name: templateData.display_name || templateData.name,
          title: templateData.title,
          json_data: templateData.json_data,
          data: { templateId: templateData.id }
        });
      } catch (err) {
        console.error('Failed to load initial template:', err);
      }
    };

    loadInitialTemplate();
  }, []); // Empty dependency array - run once on mount

  /**
   * Template Selection Handlers
   */
  const handleTemplateSelect = (template: TemplateData) => {
    setSelectedTemplate(template);
  };

  /**
   * Clear selected template after loading
   * Prevents template from reloading when component re-renders
   */
  const handleTemplateSelectClear = () => {
      setSelectedTemplate(null);
  };

  /**
   * BeeConfig Management Handlers
   */
  const handleConfigChange = async (newConfig: BeefreeConfig) => {
    setBeeConfig(newConfig);
    // Trigger editor restart with new configuration
    const win = window as WindowWithBeefreeFunctions;
    if (win.restartEditor) {
      win.restartEditor();
    }
  };

  const handleBeeConfigUpdate = (config: BeefreeConfig) => {
    setBeeConfig(config);
  };

  /**
   * Custom CSS Toggle Handler
   * Communicates with BeeConfigSidebar via window function to add/remove customCss property
   */
  const handleCustomCssToggle = (enabled: boolean) => {
    const win = window as WindowWithBeefreeFunctions;
    if (win.toggleCustomCss) {
      win.toggleCustomCss(enabled);
    }
  };

  /**
   * Move Sidebar Toggle Handler
   * Communicates with BeeConfigSidebar via window function to toggle sidebarPosition between "left" and "right"
   */
  const handleMoveSidebarToggle = (enabled: boolean) => {
    const win = window as WindowWithBeefreeFunctions;
    if (win.toggleMoveSidebar) {
      win.toggleMoveSidebar(enabled);
    }
  };

  /**
   * Group Content Tiles Toggle Handler
   * Communicates with BeeConfigSidebar via window function to add/remove modulesGroups property
   */
  const handleGroupContentTilesToggle = (enabled: boolean) => {
    const win = window as WindowWithBeefreeFunctions;
    if (win.toggleGroupContentTiles) {
      win.toggleGroupContentTiles(enabled);
    }
  };

  const setLoadingState = (key: string, value: boolean) => {
    setLoading(prev => ({ ...prev, [key]: value }));
  };

  /**
   * EXPORT HANDLERS
   * All export functions follow the same pattern:
   * 1. Open export modal with loading state
   * 2. Call Content Services API endpoint
   * 3. Display result in modal
   * Note: PDF and Image exports auto-generate HTML first if needed
   */

  /**
   * Generic export handler to eliminate code duplication
   * Handles all export types (HTML, Plain Text, PDF, Image)
   * Loads pre-generated static files (no API call, no user edits included)
   * WARNING: This exports the original template, not any changes the user made
   */
  const handleExport = async <T,>(
    exportType: 'html' | 'plain-text' | 'pdf' | 'image',
    loadingStateKey: 'html' | 'plainText' | 'pdf' | 'image',
    loaderFn: (templateId: string) => Promise<T> | T,
    setResultFn: (result: T) => void,
    errorLabel: string
  ) => {
    const templateId = (selectedTemplate?.data as any)?.templateId;
    if (!templateId) {
      console.error('Export failed: Template ID not found');
      alert('Template ID not found');
      return;
    }

    // Warn user about static export
    alert(
      '⚠️ Warning: This will export the ORIGINAL template.\n\n' +
      'Any changes you made in the editor will NOT be included.'
    );

    setExportType(exportType);
    setExportModalOpen(true);
    setExportLoading(true);
    setLoadingState(loadingStateKey, true);

    try {
      // Load pre-generated static file (may be async or sync)
      const result = await loaderFn(templateId);

      setResultFn(result);
      setExportLoading(false);

      // Show warning to user
      console.warn('⚠️ Exported the original template. User edits are NOT included.');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error(`${errorLabel} export error:`, err);
      alert(`Failed to export ${errorLabel}: ${errorMessage}`);
      setExportModalOpen(false);
    } finally {
      setLoadingState(loadingStateKey, false);
    }
  };

  /**
   * Export to HTML
   * Loads pre-generated static HTML file (no API call, no user edits included)
   */
  const handleGetHtml = () =>
    handleExport('html', 'html', loadTemplateHtml, setExportContent, 'HTML');

  /**
   * Export to Plain Text
   * Loads pre-generated static plain text file (no API call, no user edits included)
   */
  const handleGetPlainText = () =>
    handleExport('plain-text', 'plainText', loadTemplatePlainText, setExportContent, 'plain text');

  /**
   * Export to PDF
   * Uses pre-generated static PDF file (no API call, no user edits included)
   */
  const handleGetPdf = () =>
    handleExport('pdf', 'pdf', getTemplatePdfUrl, setExportPdfUrl, 'PDF');

  /**
   * Export to Image (Thumbnail)
   * Uses pre-generated static PNG file (no API call, no user edits included)
   */
  const handleGetImage = () =>
    handleExport('image', 'image', getTemplateImageUrl, setExportImageUrl, 'image');

  /**
   * Close export modal and reset all export states
   */
  const handleCloseExportModal = () => {
    setExportModalOpen(false);
    setExportContent('');
    setExportImageUrl('');
    setExportPdfUrl('');
    setExportType(null);
  };

  /**
   * HTML Import Handler
   * Sends HTML to HTML Importer API which converts it to Beefree JSON
   * Then loads the converted template into the editor
   */
  const handleHtmlImport = async (html: string) => {
    setError('');

    try {
      const response = await fetch('/v1/html-importer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to import HTML' }));
        throw new Error(errorData.error || 'Failed to import HTML');
      }

      const importedData = await response.json() as BeefreeTemplateJson;

      if (importedData && typeof importedData === 'object') {
        // Clear selected template to prevent it from reloading
        setSelectedTemplate(null);

        const win = window as WindowWithBeefreeFunctions;
        if (win.loadTemplate) {
          await win.loadTemplate(importedData);
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import HTML';
      console.error('HTML import error:', err);
      throw new Error(errorMessage);
    }
  };

  return (
    <div className="playground-container">
      {/* Header */}
      <header className="playground-header">
        <div className="header-content">
          <div className="header-left">
            <img 
              src="https://d15k2d11r6t6rl.cloudfront.net/pub/bfra/bs0kfqbg/tqu/rwx/rj4/Logo%20version%3DColored%2C%20Name%3DOn.svg" 
              alt="Beefree SDK" 
              className="logo"
            />
            <h1 className="playground-title">Playground</h1>
          </div>
          <div className="header-right">
            <button 
              onClick={() => setIsImportModalOpen(true)}
              className="btn-secondary"
            >
              Import HTML
            </button>
            <ExportDropdown 
              onExportHtml={handleGetHtml}
              onExportPlainText={handleGetPlainText}
              onExportImage={handleGetImage}
              onExportPdf={handleGetPdf}
              loading={loading}
            />
            <a 
              href="https://developers.beefree.io/signup" 
              target="_blank" 
              rel="noreferrer"
              className="btn-secondary"
            >
              Create an account
            </a>
            <a 
              href="https://developers.beefree.io/book-a-demo?utm_source=sdk-docs&utm_medium=page&utm_campaign=&utm_content=sdk-developer-docs-footer" 
              target="_blank" 
              rel="noreferrer"
              className="btn-secondary"
            >
              Book a demo
            </a>
            <a 
              href="https://docs.beefree.io/beefree-sdk" 
              target="_blank" 
              rel="noreferrer"
              className="btn-secondary"
            >
              Documentation
            </a>
          </div>
        </div>
      </header>

      <TemplateTopBar 
        onTemplateSelect={handleTemplateSelect}
        selectedTemplate={selectedTemplate}
        onCustomCssToggle={handleCustomCssToggle}
        onMoveSidebarToggle={handleMoveSidebarToggle}
        onGroupContentTilesToggle={handleGroupContentTilesToggle}
      />

      {error && (
        <div className="global-error">
          <span>{error}</span>
          <button onClick={() => setError('')} className="error-close">×</button>
        </div>
      )}
      
      <div className="main-content">
        {/* Left Panel - BeeConfig Editor */}
        <div className="config-sidebar">
          <BeeConfigSidebar 
            onConfigChange={handleConfigChange}
            currentConfig={beeConfig}
          />
        </div>

        {/* Center Panel - Beefree Editor */}
        <div className="editor-container-full">
          <BeefreeEditor
            selectedTemplate={selectedTemplate}
            beeConfig={beeConfig}
            onConfigChange={handleBeeConfigUpdate}
            onTemplateSelectClear={handleTemplateSelectClear}
          />
        </div>
      </div>

      {/* HTML Import Modal */}
      <HtmlImportModal 
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleHtmlImport}
      />

      {/* Export Result Modal */}
      <ExportResultModal 
        isOpen={exportModalOpen}
        onClose={handleCloseExportModal}
        type={exportType}
        content={exportContent}
        imageUrl={exportImageUrl}
        pdfUrl={exportPdfUrl}
        loading={exportLoading}
      />
    </div>
  );
}

export default App;
