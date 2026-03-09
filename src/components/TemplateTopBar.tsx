import { useState, useEffect } from 'react';
import { loadAllTemplates, loadTemplate } from '../services/localTemplates';
import type { TemplateData, BeefreeTemplateJson } from '../types';

/**
 * TemplateTopBar Component
 *
 * This component provides:
 * - Template dropdown to select from Template Catalog
 * - Custom CSS toggle to inject external CSS into the builder
 * - Template selection and loading logic
 *
 * Features:
 * - Fetches 10 templates on mount
 * - Handles both immediate and lazy loading of template data
 * - Auto-applies custom CSS when toggled
 * - Shows success message when CSS is applied
 */

interface TemplateTopBarProps {
  onTemplateSelect: (template: TemplateData) => void;
  selectedTemplate: TemplateData | null;
  onCustomCssToggle?: (enabled: boolean) => void;
  onMoveSidebarToggle?: (enabled: boolean) => void;
  onGroupContentTilesToggle?: (enabled: boolean) => void;
}

const TemplateTopBar: React.FC<TemplateTopBarProps> = ({
  onTemplateSelect,
  selectedTemplate,
  onCustomCssToggle,
  onMoveSidebarToggle,
  onGroupContentTilesToggle
}) => {
  const [templates, setTemplates] = useState<TemplateData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [customCssEnabled, setCustomCssEnabled] = useState(false);
  const [moveSidebarEnabled, setMoveSidebarEnabled] = useState(false);
  const [groupContentTilesEnabled, setGroupContentTilesEnabled] = useState(false);
  const [showCssMessage, setShowCssMessage] = useState(false);

  /**
   * Fetch templates from Template Catalog API on component mount
   */
  useEffect(() => {
    fetchTemplates();
  }, []);

  /**
   * Load Templates from local static files
   * No API calls - all templates are pre-generated static files
   */
  const fetchTemplates = async () => {
    setLoading(true);
    setError('');

    try {
      // Load templates from static files
      const localTemplates = await loadAllTemplates();

      // Convert to TemplateData format
      const processedTemplates: TemplateData[] = localTemplates.map(template => ({
        id: template.id,
        name: template.name,
        display_name: template.name,
        title: template.name
      }));

      setTemplates(processedTemplates);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load templates';
      setError(errorMessage);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Custom CSS Toggle
   * When enabled: Adds customCss property to beeConfig
   * When disabled: Removes customCss property from beeConfig
   * Changes are auto-applied (no need to click "Apply changes")
   */
  const handleCustomCssToggle = () => {
    const newValue = !customCssEnabled;
    setCustomCssEnabled(newValue);

    // Notify parent component (App.tsx) which calls window.toggleCustomCss
    if (onCustomCssToggle) {
      onCustomCssToggle(newValue);
    }

    // Show success message temporarily when enabling CSS
    if (newValue) {
      setShowCssMessage(true);
      setTimeout(() => {
        setShowCssMessage(false);
      }, 5000); // Auto-hide after 5 seconds
    }
  };

  /**
   * Handle Move Sidebar Toggle
   * When enabled: Sets sidebarPosition to "right"
   * When disabled: Sets sidebarPosition to "left"
   * Changes are auto-applied (no need to click "Apply changes")
   */
  const handleMoveSidebarToggle = () => {
    const newValue = !moveSidebarEnabled;
    setMoveSidebarEnabled(newValue);

    // Notify parent component (App.tsx) which calls window.toggleMoveSidebar
    if (onMoveSidebarToggle) {
      onMoveSidebarToggle(newValue);
    }
  };

  /**
   * Handle Group Content Tiles Toggle
   * When enabled: Adds modulesGroups property to beeConfig
   * When disabled: Removes modulesGroups property from beeConfig
   * Changes are auto-applied (no need to click "Apply changes")
   */
  const handleGroupContentTilesToggle = () => {
    const newValue = !groupContentTilesEnabled;
    setGroupContentTilesEnabled(newValue);

    // Notify parent component (App.tsx) which calls window.toggleGroupContentTiles
    if (onGroupContentTilesToggle) {
      onGroupContentTilesToggle(newValue);
    }
  };

  return (
    <div className="template-top-bar">
      <div className="top-bar-content">
        <div className="template-selection">
          <label htmlFor="template-select" className="template-label">
            Template:
          </label>
          {loading ? (
            <div className="loading-indicator">Loading templates...</div>
          ) : (
            <select
              id="template-select"
              className="template-select"
              value={selectedTemplate?.id || ''}
              onChange={async (e) => {
                const selectedId = e.target.value;
                if (!selectedId) return;

                try {
                  setLoading(true);
                  setError('');

                  // Load template JSON from static file
                  const fullTemplate = await loadTemplate(selectedId);

                  onTemplateSelect({
                    id: fullTemplate.id,
                    name: fullTemplate.name,
                    display_name: fullTemplate.display_name || fullTemplate.name,
                    json_data: fullTemplate.json_data as BeefreeTemplateJson | undefined,
                    // Store template ID for exports
                    data: { templateId: fullTemplate.id }
                  });
                } catch (err: unknown) {
                  const errorMessage = err instanceof Error ? err.message : 'Failed to load template';
                  setError(errorMessage);
                } finally {
                  setLoading(false);
                }
              }}
            >
              <option value="">Choose a template...</option>
              {templates.map((template) => {
                const displayName = template.display_name || template.name || template.title || 'Untitled Template';
                return (
                  <option key={template.id} value={template.id}>
                    {displayName}
                  </option>
                );
              })}
            </select>
          )}
        </div>

        <div className="custom-css-toggle-container">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={customCssEnabled}
              onChange={handleCustomCssToggle}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">Apply Custom CSS</span>
          {showCssMessage && (
            <div className="css-success-message">
              Custom CSS applied by adding the customCss parameter to the beeConfig. See beeConfig for full code.
            </div>
          )}
        </div>

        <div className="custom-css-toggle-container">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={moveSidebarEnabled}
              onChange={handleMoveSidebarToggle}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">Move Sidebar</span>
        </div>

        <div className="custom-css-toggle-container">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={groupContentTilesEnabled}
              onChange={handleGroupContentTilesToggle}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">Group Content Tiles</span>
        </div>

        {selectedTemplate && (
          <div className="selected-template-info">
            <span className="template-name">{selectedTemplate.name}</span>
          </div>
        )}
      </div>

      {error && (
        <div className="top-bar-error">
          <span>{error}</span>
          <button
            onClick={() => setError('')}
            className="error-close"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default TemplateTopBar;
