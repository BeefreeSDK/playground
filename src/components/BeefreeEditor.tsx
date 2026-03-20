import { useEffect, useRef, useState } from 'react';
import { Builder, useBuilder } from '@beefree.io/react-email-builder';
import type { IToken, IEntityContentJson, IBeeConfig } from '@beefree.io/react-email-builder';
import { authAPI } from '../services/api';
import type {
  TemplateData,
  BeefreeTemplateJson,
} from '../types/beefree';
import type { WindowWithBeefreeFunctions } from '../types/window';

interface BeefreeEditorProps {
  selectedTemplate: TemplateData | null;
  beeConfig: IBeeConfig;
}

/**
 * Normalize various API response shapes to the JSON format the Beefree SDK expects.
 * Handles json_data, json, template, or direct page structures.
 */
const normalizeTemplateJson = (input: unknown): BeefreeTemplateJson | null => {
  if (!input || typeof input !== 'object') return null;

  const obj = input as Record<string, unknown>;

  if ('json_data' in obj && obj.json_data && typeof obj.json_data === 'object') {
    const jsonData = obj.json_data as Record<string, unknown>;
    if ('page' in jsonData) return jsonData as unknown as BeefreeTemplateJson;
  }

  if ('json' in obj && obj.json && typeof obj.json === 'object') {
    const json = obj.json as Record<string, unknown>;
    if ('page' in json) return json as unknown as BeefreeTemplateJson;
  }

  if ('template' in obj && obj.template && typeof obj.template === 'object') {
    const template = obj.template as Record<string, unknown>;
    if ('page' in template) return template as unknown as BeefreeTemplateJson;
  }

  if ('page' in obj) return obj as unknown as BeefreeTemplateJson;

  return null;
};

const BeefreeEditor = ({
  selectedTemplate,
  beeConfig,
}: BeefreeEditorProps) => {
  const [token, setToken] = useState<IToken | null>(null);
  const [initialTemplate, setInitialTemplate] = useState<IEntityContentJson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const currentTemplateRef = useRef<BeefreeTemplateJson | null>(null);

  const { load, updateConfig } = useBuilder(beeConfig);

  // Fetch token and initial template on mount
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        setError('');

        const tokenData = await authAPI.getToken();
        setToken(tokenData);

        try {
          const res = await fetch('/templates/beefree-sdk-demo-template.json');
          if (res.ok) {
            const data = await res.json();
            const normalized = normalizeTemplateJson(data);
            if (normalized) {
              setInitialTemplate(normalized as IEntityContentJson);
            }
          }
        } catch {
          // template not available, start with empty editor
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        setError(`Failed to initialize editor: ${msg}`);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // Push config changes to the SDK when beeConfig prop changes
  useEffect(() => {
    if (beeConfig) {
      void updateConfig(beeConfig)
    }
  }, [beeConfig, updateConfig]);

  // Expose window functions for cross-component communication
  useEffect(() => {
    const win = window as WindowWithBeefreeFunctions;

    win.loadTemplate = async (templateData: BeefreeTemplateJson) => {
      const normalized = normalizeTemplateJson(templateData);
      if (!normalized) {
        setError('Failed to normalize template data: Invalid template format');
        return;
      }
      try {
        load(normalized as unknown as IEntityContentJson);
        currentTemplateRef.current = normalized;
        setError('');
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load template');
      }
    };

    win.restartEditor = () => {
      updateConfig({ language: beeConfig.language || 'en-US' });
    };

    return () => {
      delete win.restartEditor;
      delete win.loadTemplate;
    };
  }, [load, updateConfig, beeConfig]);

  // Load template when selected from Template Catalog
  useEffect(() => {
    if (!selectedTemplate || !token) return;

    try {
      setLoading(true);
      setError('');

      let templateData: unknown;
      if (selectedTemplate.json_data) {
        templateData = selectedTemplate.json_data;
      } else if (selectedTemplate.data && typeof selectedTemplate.data === 'object') {
        const data = selectedTemplate.data as Record<string, unknown>;
        templateData = ('json_data' in data && data.json_data) ? data.json_data : selectedTemplate.data;
      }

      const normalized = normalizeTemplateJson(templateData);
      if (!normalized) {
        setError('Failed to load template: Invalid template format');
        return;
      }

      load(normalized as unknown as IEntityContentJson);
      currentTemplateRef.current = normalized;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to load template: ${msg}`);
    } finally {
      setLoading(false);
    }
  }, [selectedTemplate?.id, token, load]);


  return (
    <div className="editor-container">
      {loading && !token && (
        <div className="editor-loading-overlay">
          <div className="editor-loading-content">
            <div className="editor-loading-text">Loading...</div>
            <div className="editor-loading-detail">Initializing editor...</div>
          </div>
        </div>
      )}

      {error && (
        <div className="editor-error-banner">
          <strong>Error:</strong> {error}
          <button onClick={() => setError('')} className="editor-error-close">
            ×
          </button>
        </div>
      )}

      {token && !loading && (
        <Builder
          id={beeConfig.container}
          token={token}
          template={(initialTemplate || { page: {} }) as IEntityContentJson}
          onSave={(json: string) => {
            currentTemplateRef.current = typeof json === 'string' ? JSON.parse(json) : json;
          }}
          onChange={(json: string) => {
            currentTemplateRef.current = typeof json === 'string' ? JSON.parse(json) : json;
          }}
          onError={(err) => setError(`Editor error: ${err.message}`)}
        />
      )}

      {token && loading && (
        <div className="editor-placeholder">
          No-code email builder loading...
        </div>
      )}
    </div>
  );
};

export default BeefreeEditor;
