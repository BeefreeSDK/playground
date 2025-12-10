import { useEffect, useRef, useState } from 'react';
import { authAPI, templateCatalogAPI } from '../services/api';
import BeefreeSDK from '@beefree.io/sdk';
import type {
  TemplateData,
  BeefreeTemplateJson,
  BeefreeConfig,
  BeefreeSDKInstance,
  ChangeResponse
} from '../types/beefree';

/**
 * BeefreeEditor Component
 * 
 * This component handles:
 * - Beefree SDK initialization and authentication
 * - Loading templates into the editor
 * - Tracking current template state
 * - BeeConfig changes and editor restarts
 * - Exposing window functions for cross-component communication
 * 
 * Key Refs:
 * - sdkRef: Stores Beefree SDK instance for API calls
 * - currentTemplateRef: Tracks the current template being edited (updated on onChange)
 * 
 * Window Functions Exposed:
 * - window.loadTemplate(templateData): Loads a new template into the editor
 * - window.restartEditor(): Restarts editor with new config
 */

interface BeefreeEditorProps {
  selectedTemplate: TemplateData | null;
  onTemplateLoad: (templateData: BeefreeTemplateJson) => void;
  onJsonChange?: (json: BeefreeTemplateJson) => void;
  beeConfig?: BeefreeConfig | null;
  onConfigChange?: (config: BeefreeConfig) => void;
  onReady?: () => void;
  onTemplateSelectClear?: () => void;
}

const BeefreeEditor: React.FC<BeefreeEditorProps> = ({
  selectedTemplate,
  onTemplateLoad,
  onJsonChange,
  beeConfig,
  onConfigChange,
  onReady,
  onTemplateSelectClear
}) => {
  const editorRef = useRef<HTMLDivElement>(null); // Reference to the DOM container for Beefree SDK
  const sdkRef = useRef<BeefreeSDKInstance | null>(null); // Reference to Beefree SDK instance
  const [isInitialized, setIsInitialized] = useState(false); // Tracks if SDK is ready
  const [loading, setLoading] = useState(false); // Loading state during initialization
  const [error, setError] = useState<string>(''); // Error message
  const [configChangeCounter, setConfigChangeCounter] = useState(0); // Triggers re-initialization when config changes

  /**
   * Normalize various API response shapes to the JSON format the Beefree SDK expects
   * Different APIs return templates in different structures, this function handles all variations
   */
  const normalizeTemplateJson = (input: unknown): BeefreeTemplateJson | null => {
    if (!input || typeof input !== 'object') return null;
    
    const obj = input as Record<string, unknown>;
    
    // Check for nested json_data
    if ('json_data' in obj && obj.json_data && typeof obj.json_data === 'object') {
      const jsonData = obj.json_data as Record<string, unknown>;
      if ('page' in jsonData) {
        return jsonData as unknown as BeefreeTemplateJson;
      }
    }
    
    // Check for json property
    if ('json' in obj && obj.json && typeof obj.json === 'object') {
      const json = obj.json as Record<string, unknown>;
      if ('page' in json) {
        return json as unknown as BeefreeTemplateJson;
      }
    }
    
    // Check for nested template
    if ('template' in obj && obj.template && typeof obj.template === 'object') {
      const template = obj.template as Record<string, unknown>;
      if ('page' in template) {
        return template as unknown as BeefreeTemplateJson;
      }
    }
    
    // Check if it's already a valid template structure
    if ('page' in obj) {
      return obj as unknown as BeefreeTemplateJson;
    }
    
    return null;
  };

  /**
   * Store current template that's being edited
   * This ref is updated via onChange callback and used for operations that need the latest template state
   * (e.g., exporting, etc.)
   */
  const currentTemplateRef = useRef<BeefreeTemplateJson | null>(null);

  /**
   * Restart editor with new config
   * Triggers re-initialization by resetting initialized state and incrementing counter
   */
  const restartWithNewConfig = () => {
    setIsInitialized(false);
    setConfigChangeCounter(prev => prev + 1);
  };

  /**
   * Window functions interface for type safety
   */
  interface WindowWithBeefreeFunctions extends Window {
    restartEditor?: () => void;
    loadTemplate?: (templateData: BeefreeTemplateJson) => Promise<void>;
  }

  /**
   * Expose functions to window object for cross-component communication
   * These functions allow other components to interact with the editor without prop drilling
   */
  useEffect(() => {
    const win = window as WindowWithBeefreeFunctions;
    
    // Expose restart function
    win.restartEditor = restartWithNewConfig;
    
    /**
     * Load a new template into the editor
     * Called by HtmlImportModal after importing HTML
     * Called by TemplateTopBar after selecting a template
     */
    win.loadTemplate = async (templateData: BeefreeTemplateJson) => {
      if (!sdkRef.current || !isInitialized) {
        const errorMessage = 'Cannot load template - SDK not ready. isInitialized: ' + isInitialized;
        console.error(errorMessage);
        setError(errorMessage);
        return;
      }

      try {
        const normalizedData = normalizeTemplateJson(templateData);
        if (!normalizedData) {
          const errorMessage = 'Failed to normalize template data: Invalid template format';
          console.error(errorMessage);
          setError(errorMessage);
          return;
        }

        console.log('Loading new template into editor');
        await sdkRef.current.load(normalizedData);
        currentTemplateRef.current = normalizedData;
        console.log('Updated currentTemplateRef with new template');
        
        // Clear any previous errors on success
        setError('');
        
        onTemplateLoad(normalizedData);
        if (onJsonChange) {
          onJsonChange(normalizedData);
        }
        
        // Clear the selected template to prevent it from reloading on re-renders
        // This allows users to edit the template without it being reset
        if (onTemplateSelectClear) {
          onTemplateSelectClear();
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load template';
        console.error('Failed to load template:', err);
        setError(errorMessage);
      }
    };

    // Cleanup: Remove window functions on unmount
    return () => {
      delete win.restartEditor;
      delete win.loadTemplate;
    };
  }, [isInitialized, onTemplateLoad, onJsonChange, onTemplateSelectClear]);

  /**
   * Initialize Beefree SDK
   * This effect runs once on mount and when configChangeCounter changes
   * 
   * Initialization steps:
   * 1. Authenticate with Beefree (get token)
   * 2. Create SDK instance
   * 3. Load initial template from /template.json
   * 4. Configure callbacks (onChange, onSave, onError)
   * 5. Start the SDK
   * 6. Update parent component with initial template
   */
  useEffect(() => {
    let disposed = false;

    const initializeSDK = async () => {
      if (disposed || isInitialized) return;

      try {
        setLoading(true);
        setError('');

        console.log('🚀 Initializing Beefree SDK...');

        // Step 1: Get authentication token using API abstraction
        const token = await authAPI.getToken('demo-user');

        if (disposed) return;

        console.log('✅ Authentication successful');

        // Step 2: Initialize Beefree SDK instance with token
        const sdk = new BeefreeSDK({ ...token, v2: true }) as unknown as BeefreeSDKInstance;
        sdkRef.current = sdk;

        const defaultBeeConfig: BeefreeConfig = {
          container: 'beefree-react-demo',
          language: 'en-US',
          sidebarPosition: 'left',
          trackChanges: true, // Required for onChange callback to work
          rowDisplayConditions: [
            {
              type: 'Last ordered catalog',
              label: 'new',
              description: 'Only new client will see this',
              before: '{% if lastOrder.catalog == "New" %}',
              after: '{% endif %}'
            }
          ],
          rowsConfiguration: {
            externalContentURLs: [
              {
                name: 'External resource',
                value: 'https://qa-bee-playground-backend.getbee.io/api/customrows?ids=1,2,3,4'
              }
            ]
          },
          mergeTags: [
            {
              name: 'first name',
              value: '[first-name]',
              previewValue: 'John'
            },
            {
              name: 'last name',
              value: '[last-name]',
              previewValue: 'Doe'
            },
            {
              name: 'email',
              value: '[email]',
              previewValue: 'john.doe@gmail.com'
            },
            {
              name: 'company',
              value: '[company]',
              previewValue: 'Company Srl'
            }
          ]
        };

        // Step 3: Merge custom config with default config
        const finalBeeConfig: BeefreeConfig = {
          ...(beeConfig || defaultBeeConfig),
          // Ensure trackChanges is enabled (required for onChange callback)
          trackChanges: true,
          // onChange callback: Fired whenever user makes changes in the editor
          // Parameters: (jsonFile, response) where jsonFile is the updated template JSON
          onChange: (jsonFile: string | BeefreeTemplateJson, response?: ChangeResponse) => {
            const templateData = typeof jsonFile === 'string' ? JSON.parse(jsonFile) : jsonFile;
            
            // Log the template JSON to browser console
            console.log('📝 onChange - Template JSON:', templateData);
            if (response) {
              console.log('📝 onChange - Change details:', response);
            }
            
            // Update ref with latest template state (used for exports, etc.)
            currentTemplateRef.current = templateData;
            console.log('onChange fired - updated currentTemplateRef');
            
            // Notify parent components of changes
            if (onJsonChange) {
              onJsonChange(templateData);
            }
            onTemplateLoad(templateData);
          },
          // onSave callback: Fired when user saves the template
          // Parameters: (jsonFile, htmlFile, ampHtml, templateVersion, language)
          onSave: (
            jsonFile: string, 
            htmlFile?: string, 
            _ampHtml?: string, // Prefix with _ to indicate intentionally unused
            templateVersion?: number, 
            language?: string
          ) => {
            const parsedJson = typeof jsonFile === 'string' ? JSON.parse(jsonFile) : jsonFile;
            
            // Log the template JSON to browser console
            console.log('💾 onSave - Template JSON:', parsedJson);
            if (htmlFile) {
              console.log('💾 onSave - HTML:', htmlFile);
            }
            if (templateVersion !== undefined) {
              console.log('💾 onSave - Version:', templateVersion);
            }
            if (language) {
              console.log('💾 onSave - Language:', language);
            }
            
            if (onJsonChange) {
              onJsonChange(parsedJson);
            }
            onTemplateLoad(parsedJson);
          },
          onError: (error: unknown) => {
            console.error('⚠️ Beefree SDK Error:', error);
            setError('Editor error: ' + (error as Error).message);
          }
        };

        if (onConfigChange && !beeConfig) {
          onConfigChange(defaultBeeConfig);
        }

        // Step 4: Load initial template from public/template.json
        let initialJson: BeefreeTemplateJson | null = null;
        try {
          const templateResponse = await fetch('/template.json');
          if (templateResponse.ok) {
            initialJson = await templateResponse.json();
            console.log('📄 Loaded initial template from /template.json');
            console.log('Template has rows:', initialJson?.page?.rows?.length || 0);
          } else {
            console.log('Template.json not found, starting empty');
          }
        } catch (err) {
          console.log('Error loading template.json:', err);
        }

        // Step 5: Start the Beefree SDK with configuration and initial template
        console.log('▶️ Starting Beefree SDK with initial template...');
        console.log('initialJson provided to SDK:', !!initialJson);
        await sdk.start(finalBeeConfig, initialJson, '', { shared: false });

        if (disposed) return;

        // Step 6: Update parent component with initial template
        // This ensures currentJson in App.tsx is set, allowing exports to work immediately
        if (initialJson) {
          currentTemplateRef.current = initialJson;
          console.log('Set initial template in currentTemplateRef');
          
          // IMPORTANT: Call onTemplateLoad so parent component (App.tsx) updates currentJson
          // This allows Export functionality to work with the initial template
          onTemplateLoad(initialJson);
          
          // Also notify onChange handler if provided
          if (onJsonChange) {
            onJsonChange(initialJson);
          }
        }
        
        // Give onChange a moment to fire, then ensure ref is set
        setTimeout(() => {
          if (initialJson && !currentTemplateRef.current) {
            currentTemplateRef.current = initialJson;
            console.log('Ensured initial template is in currentTemplateRef');
          }
        }, 100);

        setIsInitialized(true);
        setLoading(false);
        console.log('✨ Beefree SDK initialized successfully!');
        
        if (onReady) {
          onReady();
        }

      } catch (err: unknown) {
        if (disposed) return;
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('💥 Failed to initialize Beefree SDK:', err);
        setError(`Failed to initialize editor: ${errorMessage}`);
        setLoading(false);
      }
    };

    initializeSDK();

    return () => {
      disposed = true;
      if (sdkRef.current) {
        try {
          if (typeof sdkRef.current.destroy === 'function') {
            sdkRef.current.destroy();
          }
        } catch (err) {
          console.error('Error disposing SDK:', err);
        }
      }
    };
  }, [isInitialized, onTemplateLoad, configChangeCounter]);

  /**
   * Load template when selected from Template Catalog
   * This effect runs whenever selectedTemplate changes
   */
  useEffect(() => {
    const loadTemplate = async () => {
      if (!sdkRef.current || !selectedTemplate) return;

      try {
        setLoading(true);
        setError('');

        let templateData: unknown;

        if (selectedTemplate.json_data) {
          templateData = selectedTemplate.json_data;
        } else if (selectedTemplate.data && typeof selectedTemplate.data === 'object') {
          const data = selectedTemplate.data as Record<string, unknown>;
          if ('json_data' in data && data.json_data) {
            templateData = data.json_data;
          } else {
            templateData = selectedTemplate.data;
          }
        } else {
          try {
            const fullTemplate = await templateCatalogAPI.getTemplate(selectedTemplate.id);
            templateData = fullTemplate.json_data || fullTemplate;
          } catch (err) {
            console.error('Failed to fetch template data:', err);
            templateData = {
              page: {
                body: {
                  container: {
                    style: {
                      "background-color": "#fff"
                    }
                  },
                  content: {
                    computedStyle: {
                      linkColor: "#8a3b8f",
                      messageBackgroundColor: "transparent",
                      messageWidth: "650px"
                    },
                    style: {
                      color: "#000000",
                      "font-family": "Lato, Tahoma, Verdana, Segoe, sans-serif"
                    }
                  },
                  type: "mailup-bee-page-properties"
                },
                rows: [
                  {
                    container: {
                      style: {
                        "background-color": "transparent"
                      }
                    },
                    content: {
                      style: {
                        "background-color": "transparent",
                        color: "#000000",
                        width: "500px"
                      }
                    },
                    columns: [
                      {
                        style: {
                          "background-color": "transparent",
                          "padding-bottom": "5px",
                          "padding-top": "5px"
                        },
                        modules: [
                          {
                            type: "mailup-bee-newsletter-modules-heading",
                            descriptor: {
                              heading: {
                                title: "h1",
                                text: selectedTemplate.name || "Template",
                                style: {
                                  color: "#555555",
                                  "font-size": "23px",
                                  "font-family": "inherit",
                                  "line-height": "120%",
                                  "text-align": "left",
                                  "font-weight": "700"
                                }
                              },
                              style: {
                                width: "100%",
                                "text-align": "center"
                              }
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            };
          }
        }

        const normalizedData = normalizeTemplateJson(templateData);
        if (!normalizedData) {
          console.error('Failed to normalize template data');
          setError('Failed to load template: Invalid template format');
          setLoading(false);
          return;
        }
        await sdkRef.current.load(normalizedData);
        currentTemplateRef.current = normalizedData;
        onTemplateLoad(normalizedData);
        
        // Clear the selected template to prevent it from reloading on re-renders
        // This allows users to edit the template without it being reset
        if (onTemplateSelectClear) {
          onTemplateSelectClear();
        }
        
        setLoading(false);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('Failed to load template:', err);
        setError(`Failed to load template: ${errorMessage}`);
        setLoading(false);
      }
    };

    if (isInitialized && selectedTemplate) {
      loadTemplate();
    }
  }, [selectedTemplate, isInitialized, onTemplateLoad, onTemplateSelectClear]);

  return (
    <div className="editor-container">
      {loading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '10px' }}>Loading...</div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              {selectedTemplate ? 'Loading template...' : 'Initializing editor...'}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          right: '20px',
          zIndex: 1000,
          background: '#ffebee',
          color: '#d32f2f',
          padding: '15px',
          borderRadius: '4px',
          border: '1px solid #ffcdd2'
        }}>
          <strong>Error:</strong> {error}
          <button 
            onClick={() => setError('')}
            style={{
              float: 'right',
              background: 'none',
              border: 'none',
              color: '#d32f2f',
              cursor: 'pointer',
              fontSize: '18px'
            }}
          >
            ×
          </button>
        </div>
      )}

      {!isInitialized && !loading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: '#666',
          zIndex: 100,
          fontSize: '18px'
        }}>
          No-code email builder loading...
        </div>
      )}

      <div 
        id="beefree-react-demo" 
        ref={editorRef}
        style={{ 
          width: '100%', 
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }} 
      />
    </div>
  );
};

export default BeefreeEditor;
