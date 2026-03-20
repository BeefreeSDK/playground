import type { BeefreeTemplateJson } from './beefree';

/**
 * Window interface extensions for Beefree SDK integration
 *
 * These functions are exposed on the window object to enable
 * cross-component communication without complex prop drilling
 */

export interface WindowWithBeefreeFunctions extends Window {
  // Template loading function exposed by BeefreeEditor
  loadTemplate?: (templateData: BeefreeTemplateJson) => Promise<void>;

  // Editor restart function exposed by BeefreeEditor
  restartEditor?: () => void;

  // Configuration toggle functions exposed by BeeConfigSidebar
  toggleCustomCss?: (enabled: boolean) => void;
  toggleMoveSidebar?: (enabled: boolean) => void;
  toggleGroupContentTiles?: (enabled: boolean) => void;
}

// Type-safe window access
export const getWindow = (): WindowWithBeefreeFunctions => window as WindowWithBeefreeFunctions;
