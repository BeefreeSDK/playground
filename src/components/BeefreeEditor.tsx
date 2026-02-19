import { useEffect, useRef, useState } from 'react';
import { authAPI } from '../services/api';
import BeefreeSDK from '@beefree.io/sdk';
import type {
  TemplateData,
  BeefreeTemplateJson,
  BeefreeConfig,
  BeefreeSDKInstance,
  ChangeResponse
} from '../types/beefree';
import type { WindowWithBeefreeFunctions } from '../types/window';
import { DEFAULT_BEE_CONFIG } from '../constants';

/**
 * BeefreeEditor Component
 *
 * Handles Beefree SDK initialization, authentication, template loading,
 * config changes, and editor restarts.
 *
 * Exposes window functions for cross-component communication:
 * - window.loadTemplate(templateData)
 * - window.restartEditor()
 */

interface BeefreeEditorProps {
  selectedTemplate: TemplateData | null;
  beeConfig?: BeefreeConfig | null;
  onConfigChange?: (config: BeefreeConfig) => void;
  onTemplateSelectClear?: () => void;
}

const BeefreeEditor: React.FC<BeefreeEditorProps> = ({
  selectedTemplate,
  beeConfig,
  onConfigChange,
  onTemplateSelectClear
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const sdkRef = useRef<BeefreeSDKInstance | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [configChangeCounter, setConfigChangeCounter] = useState(0);

  /**
   * Normalize various API response shapes to the JSON format the Beefree SDK expects.
   * Handles json_data, json, template, or direct page structures.
   */
  const normalizeTemplateJson = (input: unknown): BeefreeTemplateJson | null => {
    if (!input || typeof input !== 'object') return null;

    const obj = input as Record<string, unknown>;

    if ('json_data' in obj && obj.json_data && typeof obj.json_data === 'object') {
      const jsonData = obj.json_data as Record<string, unknown>;
      if ('page' in jsonData) {
        return jsonData as unknown as BeefreeTemplateJson;
      }
    }

    if ('json' in obj && obj.json && typeof obj.json === 'object') {
      const json = obj.json as Record<string, unknown>;
      if ('page' in json) {
        return json as unknown as BeefreeTemplateJson;
      }
    }

    if ('template' in obj && obj.template && typeof obj.template === 'object') {
      const template = obj.template as Record<string, unknown>;
      if ('page' in template) {
        return template as unknown as BeefreeTemplateJson;
      }
    }

    if ('page' in obj) {
      return obj as unknown as BeefreeTemplateJson;
    }

    return null;
  };

  const currentTemplateRef = useRef<BeefreeTemplateJson | null>(null);

  const restartWithNewConfig = () => {
    setIsInitialized(false);
    setConfigChangeCounter(prev => prev + 1);
  };

  /**
   * Expose functions to window object for cross-component communication.
   */
  useEffect(() => {
    const win = window as WindowWithBeefreeFunctions;

    win.restartEditor = restartWithNewConfig;

    win.loadTemplate = async (templateData: BeefreeTemplateJson) => {
      if (!sdkRef.current || !isInitialized) {
        setError('Cannot load template - SDK not ready');
        return;
      }

      try {
        const normalizedData = normalizeTemplateJson(templateData);
        if (!normalizedData) {
          setError('Failed to normalize template data: Invalid template format');
          return;
        }

        await sdkRef.current.load(normalizedData);
        currentTemplateRef.current = normalizedData;
        setError('');
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load template';
        setError(errorMessage);
      }
    };

    return () => {
      delete win.restartEditor;
      delete win.loadTemplate;
    };
  }, [isInitialized, onTemplateSelectClear]);

  /**
   * Initialize Beefree SDK:
   * 1. Authenticate (get token)
   * 2. Create SDK instance
   * 3. Load initial template from /template.json
   * 4. Configure callbacks (onChange, onSave, onError)
   * 5. Start the SDK
   */
  useEffect(() => {
    let disposed = false;

    const initializeSDK = async () => {
      if (disposed || isInitialized) return;

      try {
        setLoading(true);
        setError('');

        const token = await authAPI.getToken('demo-user');
        if (disposed) return;

        const sdk = new BeefreeSDK({ ...token, v2: true }) as unknown as BeefreeSDKInstance;
        sdkRef.current = sdk;

        const finalBeeConfig: BeefreeConfig = {
          ...(beeConfig || DEFAULT_BEE_CONFIG),
          trackChanges: true,
          onChange: (jsonFile: string | BeefreeTemplateJson, _response?: ChangeResponse) => {
            const templateData = typeof jsonFile === 'string' ? JSON.parse(jsonFile) : jsonFile;
            currentTemplateRef.current = templateData;
          },
          onSave: (
            jsonFile: string,
            _htmlFile?: string,
            _ampHtml?: string,
            _templateVersion?: number,
            _language?: string
          ) => {
            const parsedJson = typeof jsonFile === 'string' ? JSON.parse(jsonFile) : jsonFile;
            currentTemplateRef.current = parsedJson;
          },
          onError: (error: unknown) => {
            setError('Editor error: ' + (error as Error).message);
          }
        };

        if (onConfigChange && !beeConfig) {
          onConfigChange(DEFAULT_BEE_CONFIG);
        }

        let initialJson: BeefreeTemplateJson | null = null;
        try {
          const templateResponse = await fetch('/template.json');
          if (templateResponse.ok) {
            initialJson = await templateResponse.json();
          }
        } catch {
          // template.json not available, start with empty editor
        }

        await sdk.start(finalBeeConfig, initialJson, '', { shared: false });

        if (disposed) return;

        if (initialJson) {
          currentTemplateRef.current = initialJson;
        }

        setIsInitialized(true);
        setLoading(false);
      } catch (err: unknown) {
        if (disposed) return;
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
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
        } catch {
          // SDK disposal error handled silently
        }
      }
    };
  }, [isInitialized, configChangeCounter]);

  /**
   * Load template when selected from Template Catalog.
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
        }

        const normalizedData = normalizeTemplateJson(templateData);
        if (!normalizedData) {
          setError('Failed to load template: Invalid template format');
          setLoading(false);
          return;
        }
        await sdkRef.current.load(normalizedData);
        currentTemplateRef.current = normalizedData;

        setLoading(false);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(`Failed to load template: ${errorMessage}`);
        setLoading(false);
      }
    };

    if (isInitialized && selectedTemplate) {
      loadTemplate();
    }
  }, [selectedTemplate?.id, isInitialized]);

  return (
    <div className="editor-container">
      {loading && (
        <div className="editor-loading-overlay">
          <div className="editor-loading-content">
            <div className="editor-loading-text">Loading...</div>
            <div className="editor-loading-detail">
              {selectedTemplate ? 'Loading template...' : 'Initializing editor...'}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="editor-error-banner">
          <strong>Error:</strong> {error}
          <button
            onClick={() => setError('')}
            className="editor-error-close"
          >
            ×
          </button>
        </div>
      )}

      {!isInitialized && !loading && (
        <div className="editor-placeholder">
          No-code email builder loading...
        </div>
      )}

      <div
        id="beefree-react-demo"
        ref={editorRef}
        className="editor-sdk-container"
      />
    </div>
  );
};

export default BeefreeEditor;
