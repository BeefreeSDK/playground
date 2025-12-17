import { useState, useEffect } from 'react';
import type { BeefreeConfig } from '../types/beefree';
import { DEFAULT_BEE_CONFIG } from '../constants';

/**
 * BeeConfigSidebar Component
 * 
 * This component provides:
 * - Editable JSON textarea for beeConfig
 * - "Apply changes" button to restart editor with new config
 * - "Reset" button to restore default config
 * - Window functions for configuration toggles
 * 
 * Features:
 * - Real-time JSON editing with syntax validation
 * - Fills vertical space for comfortable editing
 * - Auto-apply when toggling configuration (no manual apply needed)
 */

interface BeeConfigSidebarProps {
  onConfigChange: (config: BeefreeConfig) => void;
  currentConfig: BeefreeConfig | null;
}

const BeeConfigSidebar: React.FC<BeeConfigSidebarProps> = ({ onConfigChange, currentConfig }) => {
  const [configText, setConfigText] = useState('');
  const [error, setError] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  /**
   * Window functions interface for type safety
   */
  interface WindowWithToggleFunctions extends Window {
    toggleCustomCss?: (enabled: boolean) => void;
    toggleMoveSidebar?: (enabled: boolean) => void;
    toggleGroupContentTiles?: (enabled: boolean) => void;
  }

  /**
   * Expose functions to toggle configuration from TemplateTopBar
   * These functions are called via window.toggle* functions
   * 
   * Flow:
   * 1. Parse current JSON config
   * 2. Add or remove configuration property
   * 3. Update textarea with new JSON
   * 4. Auto-apply changes (triggers editor restart)
   */
  useEffect(() => {
    const win = window as WindowWithToggleFunctions;
    
    win.toggleCustomCss = (enabled: boolean) => {
      try {
        const currentConfig: BeefreeConfig = configText ? JSON.parse(configText) : { container: 'beefree-react-demo' };
        
        if (enabled) {
          // Add customCss URL to config (using local file)
          currentConfig.customCss = "/assets/css/beefree-custom-design.css";
        } else {
          // Remove customCss from config
          delete currentConfig.customCss;
        }
        
        // Update the textarea to show changes
        const newConfigText = JSON.stringify(currentConfig, null, 2);
        setConfigText(newConfigText);
        
        // Automatically apply the changes (no need for user to click "Apply changes")
        onConfigChange(currentConfig);
      } catch (err) {
        console.error('Error toggling custom CSS:', err);
      }
    };

    /**
     * Expose function to toggle sidebar position from TemplateTopBar
     * This function is called via window.toggleMoveSidebar(enabled)
     * 
     * Flow:
     * 1. Parse current JSON config
     * 2. Set sidebarPosition to "right" when enabled, "left" when disabled
     * 3. Update textarea with new JSON
     * 4. Auto-apply changes (triggers editor restart)
     */
    win.toggleMoveSidebar = (enabled: boolean) => {
      try {
        const currentConfig: BeefreeConfig = configText ? JSON.parse(configText) : { container: 'beefree-react-demo' };
        
        if (enabled) {
          // Set sidebarPosition to "right"
          currentConfig.sidebarPosition = "right";
        } else {
          // Set sidebarPosition to "left" (default)
          currentConfig.sidebarPosition = "left";
        }
        
        // Update the textarea to show changes
        const newConfigText = JSON.stringify(currentConfig, null, 2);
        setConfigText(newConfigText);
        
        // Automatically apply the changes (no need for user to click "Apply changes")
        onConfigChange(currentConfig);
      } catch (err) {
        console.error('Error toggling sidebar position:', err);
      }
    };

    /**
     * Expose function to toggle modules groups from TemplateTopBar
     * This function is called via window.toggleGroupContentTiles(enabled)
     * 
     * Flow:
     * 1. Parse current JSON config
     * 2. Add or remove modulesGroups property
     * 3. Update textarea with new JSON
     * 4. Auto-apply changes (triggers editor restart)
     */
    win.toggleGroupContentTiles = (enabled: boolean) => {
      try {
        const currentConfig: BeefreeConfig = configText ? JSON.parse(configText) : { container: 'beefree-react-demo' };
        
        if (enabled) {
          // Add modulesGroups configuration
          currentConfig.modulesGroups = [
            {
              label: "Text",
              collapsable: false,
              collapsedOnLoad: false,
              modulesNames: [
                "List",
                "Paragraph",
                "Heading"
              ]
            },
            {
              label: "Media",
              collapsable: true,
              collapsedOnLoad: false,
              modulesNames: [
                "Video",
                "Image",
                "Icons"
              ]
            },
            {
              label: "Calls to Action",
              collapsable: true,
              collapsedOnLoad: false,
              modulesNames: [
                "Button",
                "Social"
              ]
            },
            {
              label: "Styling",
              collapsable: true,
              collapsedOnLoad: false,
              modulesNames: [
                "Divider",
                "Spacer"
              ]
            },
            {
              label: "Advanced",
              collapsable: true,
              collapsedOnLoad: true,
              modulesNames: [
                "Table",
                "Html",
                "Menu"
              ]
            }
          ];
        } else {
          // Remove modulesGroups from config
          delete currentConfig.modulesGroups;
        }
        
        // Update the textarea to show changes
        const newConfigText = JSON.stringify(currentConfig, null, 2);
        setConfigText(newConfigText);
        
        // Automatically apply the changes (no need for user to click "Apply changes")
        onConfigChange(currentConfig);
      } catch (err) {
        console.error('Error toggling group content tiles:', err);
      }
    };

    // Cleanup: Remove window functions on unmount
    return () => {
      delete win.toggleCustomCss;
      delete win.toggleMoveSidebar;
      delete win.toggleGroupContentTiles;
    };
  }, [configText, onConfigChange]);

  /**
   * Sync textarea with incoming config changes
   * Formats JSON with 2-space indentation for readability
   */
  useEffect(() => {
    if (currentConfig) {
      setConfigText(JSON.stringify(currentConfig, null, 2));
    }
  }, [currentConfig]);

  /**
   * Apply Changes Handler
   * Validates JSON and sends to parent to restart editor
   */
  const handleApplyChanges = async () => {
    setError('');
    setIsApplying(true);

    try {
      // Validate JSON before applying
      const parsedConfig = JSON.parse(configText) as BeefreeConfig;
      await onConfigChange(parsedConfig);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid JSON format';
      setError(`Invalid JSON: ${errorMessage}`);
    } finally {
      setIsApplying(false);
    }
  };

  /**
   * Reset to Default Configuration
   * Loads the default config and applies it
   */
  const resetToDefault = () => {
    const defaultConfig = { ...DEFAULT_BEE_CONFIG };
    setConfigText(JSON.stringify(defaultConfig, null, 2));
    setError('');
  };

  /**
   * Reset to Default and Apply
   * Resets config and immediately applies it (refreshes builder)
   */
  const handleResetAndApply = async () => {
    const defaultConfig = { ...DEFAULT_BEE_CONFIG };
    setConfigText(JSON.stringify(defaultConfig, null, 2));
    setError('');
    setIsApplying(true);

    try {
      await onConfigChange(defaultConfig);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to apply configuration';
      setError(`Error: ${errorMessage}`);
    } finally {
      setIsApplying(false);
    }
  };

  /**
   * Check if current config differs from default
   * Returns true if config is different from default
   */
  const isConfigDifferentFromDefault = (): boolean => {
    // Don't show reset button if config is empty
    if (!configText || !configText.trim()) {
      return false;
    }

    try {
      const currentParsed = JSON.parse(configText);
      const defaultConfig = { ...DEFAULT_BEE_CONFIG };

      // Deep comparison of configs
      return JSON.stringify(currentParsed) !== JSON.stringify(defaultConfig);
    } catch {
      // If JSON is invalid but not empty, consider it different
      return true;
    }
  };

  const showResetButton = isConfigDifferentFromDefault();

  return (
    <div className="bee-config-sidebar">
      <div className="config-header">
        <h3>beeConfig</h3>
        <button 
          onClick={resetToDefault}
          className="reset-button"
          title="Reset to default configuration"
        >
          Reset
        </button>
      </div>
      
      <div className="config-editor">
        <textarea
          value={configText}
          onChange={(e) => setConfigText(e.target.value)}
          className="config-textarea"
          placeholder="Enter beeConfig JSON..."
          spellCheck={false}
        />
      </div>

      {error && (
        <div className="config-error">
          <span>{error}</span>
        </div>
      )}

      <div className="config-actions">
        <button
          onClick={handleApplyChanges}
          disabled={isApplying || !configText.trim()}
          className="apply-button"
        >
          {isApplying ? 'Applying...' : 'Apply changes'}
        </button>
        {showResetButton && (
          <button
            onClick={handleResetAndApply}
            disabled={isApplying}
            className="reset-apply-button"
            title="Reset to default configuration and apply"
          >
            Reset
          </button>
        )}
      </div>

      <div className="config-info">
        <p>Edit the beeConfig JSON above and click "Apply changes" to reload the builder with the new configuration.</p>
        <p>
          <a 
            href="https://docs.beefree.io/beefree-sdk/reference/sdk-configuration" 
            target="_blank" 
            rel="noreferrer"
            className="docs-link"
          >
            See documentation for available options
          </a>
        </p>
      </div>
    </div>
  );
};

export default BeeConfigSidebar;
