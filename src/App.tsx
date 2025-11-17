import './App.css';
import TemplateTopBar from './components/TemplateTopBar';
import BeefreeEditor from './components/BeefreeEditor';
import BeeConfigSidebar from './components/BeeConfigSidebar';
import ExportDropdown from './components/ExportDropdown';
import HtmlImportModal from './components/HtmlImportModal';
import ExportResultModal from './components/ExportResultModal';
import { useState, useRef } from 'react';
import type { TemplateData, BeefreeTemplateJson, BeefreeConfig } from './types';

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
  const [currentJson, setCurrentJson] = useState<BeefreeTemplateJson | null>(null); // Current template JSON in the editor
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
  
  // Ref to store last generated HTML (used for PDF and Image exports which require HTML)
  const lastHtmlRef = useRef<string | undefined>(undefined);

  /**
   * Template Selection Handlers
   */
  const handleTemplateSelect = (template: TemplateData) => {
    setSelectedTemplate(template);
  };

  const handleTemplateLoad = (templateData: BeefreeTemplateJson) => {
    setCurrentJson(templateData);
  };

  const handleJsonChange = (json: BeefreeTemplateJson) => {
    setCurrentJson(json);
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
   * Window functions interface for type safety
   */
  interface WindowWithBeefreeFunctions extends Window {
    toggleCustomCss?: (enabled: boolean) => void;
    toggleMoveSidebar?: (enabled: boolean) => void;
    toggleGroupContentTiles?: (enabled: boolean) => void;
    loadTemplate?: (templateData: BeefreeTemplateJson) => Promise<void>;
    restartEditor?: () => void;
  }

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
   * Export to HTML
   * Converts the current template JSON to HTML using Content Services API
   */
  const handleGetHtml = async () => {
    if (!currentJson) {
      alert('No template loaded. Please select a template first.');
      return;
    }

    setExportType('html');
    setExportModalOpen(true);
    setExportLoading(true);
    setLoadingState('html', true);

    try {
      const response = await fetch('/v1/message/html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentJson),
      });

      if (!response.ok) {
        alert('Failed to convert to HTML');
        setExportModalOpen(false);
        return;
      }

      const raw = await response.text();
      let html = raw;
      try {
        const maybeJson = JSON.parse(raw);
        const candidate = (maybeJson && maybeJson.body && (maybeJson.body.html || maybeJson.body.result || maybeJson.body)) || undefined;
        if (typeof candidate === 'string') {
          html = candidate;
        }
      } catch {}
      
      lastHtmlRef.current = html;
      setExportContent(html);
      setExportLoading(false);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('HTML export error:', err);
      alert('Failed to export HTML: ' + errorMessage);
      setExportModalOpen(false);
    } finally {
      setLoadingState('html', false);
    }
  };

  /**
   * Export to Plain Text
   * Converts the current template JSON to plain text using Content Services API
   */
  const handleGetPlainText = async () => {
    if (!currentJson) {
      alert('No template loaded. Please select a template first.');
      return;
    }

    setExportType('plain-text');
    setExportModalOpen(true);
    setExportLoading(true);
    setLoadingState('plainText', true);

    try {
      const response = await fetch('/v1/message/plain-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentJson),
      });

      if (!response.ok) {
        alert('Failed to convert to Plain Text');
        setExportModalOpen(false);
        return;
      }

      const text = await response.text();
      setExportContent(text);
      setExportLoading(false);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Plain text export error:', err);
      alert('Failed to export plain text: ' + errorMessage);
      setExportModalOpen(false);
    } finally {
      setLoadingState('plainText', false);
    }
  };

  /**
   * Export to PDF
   * Auto-generates HTML first if needed, then creates PDF
   * PDF export requires HTML (not JSON), so we convert first
   */
  const handleGetPdf = async () => {
    if (!currentJson) {
      alert('No template loaded. Please select a template first.');
      return;
    }

    setExportType('pdf');
    setExportModalOpen(true);
    setExportLoading(true);
    setLoadingState('pdf', true);

    try {
      // Auto-generate HTML first if not already done
      let html = lastHtmlRef.current;
      if (!html) {
        const htmlResponse = await fetch('/v1/message/html', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(currentJson),
        });

        if (!htmlResponse.ok) {
          alert('Failed to generate HTML for PDF');
          setExportModalOpen(false);
          return;
        }

        const raw = await htmlResponse.text();
        html = raw;
        try {
          const maybeJson = JSON.parse(raw);
          const candidate = (maybeJson && maybeJson.body && (maybeJson.body.html || maybeJson.body.result || maybeJson.body)) || undefined;
          if (typeof candidate === 'string') {
            html = candidate;
          }
        } catch {}
        
        lastHtmlRef.current = html;
      }

      // Generate PDF
      const response = await fetch('/v1/message/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_size: 'Full',
          page_orientation: 'landscape',
          html: html
        }),
      });

      if (!response.ok) {
        alert('Failed to convert to PDF');
        setExportModalOpen(false);
        return;
      }

      const data = await response.json();
      const url = data && data.body && data.body.url ? data.body.url : undefined;
      setExportPdfUrl(url || '');
      setExportLoading(false);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('PDF export error:', err);
      alert('Failed to export PDF: ' + errorMessage);
      setExportModalOpen(false);
    } finally {
      setLoadingState('pdf', false);
    }
  };

  /**
   * Export to Image (Thumbnail)
   * Auto-generates HTML first if needed, then creates PNG image
   * Image export requires HTML (not JSON), so we convert first
   */
  const handleGetImage = async () => {
    if (!currentJson) {
      alert('No template loaded. Please select a template first.');
      return;
    }

    setExportType('image');
    setExportModalOpen(true);
    setExportLoading(true);
    setLoadingState('image', true);

    try {
      // Auto-generate HTML first if not already done
      let html = lastHtmlRef.current;
      if (!html) {
        const htmlResponse = await fetch('/v1/message/html', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(currentJson),
        });

        if (!htmlResponse.ok) {
          alert('Failed to generate HTML for image');
          setExportModalOpen(false);
          return;
        }

        const raw = await htmlResponse.text();
        html = raw;
        try {
          const maybeJson = JSON.parse(raw);
          const candidate = (maybeJson && maybeJson.body && (maybeJson.body.html || maybeJson.body.result || maybeJson.body)) || undefined;
          if (typeof candidate === 'string') {
            html = candidate;
          }
        } catch {}
        
        lastHtmlRef.current = html;
      }

      // Generate Image
      const response = await fetch('/v1/message/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file_type: 'png',
          size: '1000',
          html: html
        }),
      });

      if (!response.ok) {
        alert('Failed to create Image');
        setExportModalOpen(false);
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setExportImageUrl(url);
      setExportLoading(false);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Image export error:', err);
      alert('Failed to export image: ' + errorMessage);
      setExportModalOpen(false);
    } finally {
      setLoadingState('image', false);
    }
  };

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
        setCurrentJson(importedData);
        
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
            onTemplateLoad={handleTemplateLoad}
            onJsonChange={handleJsonChange}
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
