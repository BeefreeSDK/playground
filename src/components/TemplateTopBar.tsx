import { useState, useEffect } from 'react';
import axios from 'axios';
import type { TemplateData } from '../types';

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
   * Fetch Templates from Template Catalog
   * Retrieves first 10 templates and processes them into a consistent format
   * Handles various API response shapes
   */
  const fetchTemplates = async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch first 10 templates from the catalog
      const response = await axios.get('/api/templates?limit=10');

      console.log('Templates API response:', response.data);

      // Handle different response structures for template lists
      let templatesArray: unknown[] = [];
      const data = response.data;

      if (Array.isArray(data)) {
        templatesArray = data;
      } else if (data?.results && Array.isArray(data.results)) {
        templatesArray = data.results;
      } else if (data?.templates && Array.isArray(data.templates)) {
        templatesArray = data.templates;
      } else if (data?.items && Array.isArray(data.items)) {
        templatesArray = data.items;
      } else if (data?.data && Array.isArray(data.data)) {
        templatesArray = data.data;
      }

      console.log('Raw API data structure:', data);
      console.log('Found templates array:', templatesArray.length, 'templates');

      // Process templates to ensure they have the structure we need
      // Limit to first 10 templates
      const processedTemplates: TemplateData[] = templatesArray
        .filter((template): template is Record<string, unknown> => {
          return template !== null && typeof template === 'object' &&
                 ('id' in template || 'slug' in template);
        })
        .slice(0, 10) // Limit to 10 templates
        .map((template, index): TemplateData => {
          const templateObj = template as Record<string, unknown>;
          return {
            id: (typeof templateObj.id === 'string' ? templateObj.id :
                 typeof templateObj.slug === 'string' ? templateObj.slug :
                 `template-${index}`),
            name: (typeof templateObj.title === 'string' ? templateObj.title :
                   typeof templateObj.display_name === 'string' ? templateObj.display_name :
                   typeof templateObj.name === 'string' ? templateObj.name :
                   typeof templateObj.id === 'string' ? templateObj.id :
                   'Untitled'),
            display_name: typeof templateObj.display_name === 'string' ? templateObj.display_name :
                          typeof templateObj.title === 'string' ? templateObj.title :
                          typeof templateObj.name === 'string' ? templateObj.name :
                          undefined,
            title: typeof templateObj.title === 'string' ? templateObj.title : undefined,
            json_data: templateObj.json_data as TemplateData['json_data'],
            category: typeof templateObj.category === 'string' ? templateObj.category : undefined,
            collection: typeof templateObj.collection === 'string' ? templateObj.collection : undefined,
            designer: typeof templateObj.designer === 'string' ? templateObj.designer : undefined,
            tags: Array.isArray(templateObj.tags) ? templateObj.tags as string[] : undefined,
            thumbnail: typeof templateObj.thumbnail === 'string' ? templateObj.thumbnail : undefined,
            data: templateObj
          };
        });

      setTemplates(processedTemplates);
      console.log('Processed templates (first 10):', processedTemplates.length);
      console.log('Template names:', processedTemplates.map(t => t.name));
    } catch (err) {
      setError('Failed to fetch templates');
      console.error('Error fetching templates:', err);
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
                const template = templates.find(t => t.id === selectedId);
                if (template) {
                  // If template already has json_data, use it directly
                  if (template.json_data) {
                    onTemplateSelect({
                      id: template.id,
                      name: template.display_name || template.name,
                      display_name: template.display_name,
                      json_data: template.json_data,
                      data: template
                    });
                  } else {
                    // Fetch full template details including json_data
                    try {
                      setLoading(true);
                      const response = await axios.get(`/api/templates/${selectedId}`);
                      const fullTemplate = response.data;

                      onTemplateSelect({
                        id: template.id,
                        name: template.display_name || template.name,
                        display_name: template.display_name,
                        json_data: fullTemplate.json_data || fullTemplate,
                        data: fullTemplate
                      });
                    } catch (err: unknown) {
                      console.error('Failed to fetch template details:', err);
                      setError('Failed to load template');
                    } finally {
                      setLoading(false);
                    }
                  }
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
