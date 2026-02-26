/**
 * Beefree SDK Type Definitions
 * 
 * Proper TypeScript types to replace 'any' usage throughout the codebase
 */

/**
 * Template JSON structure from Beefree SDK
 */
export interface BeefreeTemplateJson {
  page: {
    body: {
      container?: {
        style?: Record<string, string>;
      };
      content?: {
        computedStyle?: Record<string, string>;
        style?: Record<string, string>;
      };
      type?: string;
    };
    rows?: BeefreeRow[];
  };
}

/**
 * Beefree Row structure
 */
export interface BeefreeRow {
  container?: {
    style?: Record<string, string>;
  };
  content?: {
    style?: Record<string, string>;
  };
  columns?: BeefreeColumn[];
}

/**
 * Beefree Column structure
 */
export interface BeefreeColumn {
  style?: Record<string, string>;
  grid?: number[];
  modules?: BeefreeModule[];
}

/**
 * Beefree Module structure
 */
export interface BeefreeModule {
  type: string;
  descriptor?: Record<string, unknown>;
  style?: Record<string, string>;
}

/**
 * Beefree SDK Configuration
 */
export interface BeefreeConfig {
  container: string;
  language?: string;
  sidebarPosition?: 'left' | 'right';
  trackChanges?: boolean;
  customCss?: string;
  modulesGroups?: ModuleGroup[];
  rowDisplayConditions?: DisplayCondition[];
  rowsConfiguration?: RowsConfiguration;
  mergeTags?: MergeTag[];
  [key: string]: unknown; // Allow additional config properties
}

/**
 * Module Group configuration
 */
export interface ModuleGroup {
  label: string;
  collapsable: boolean;
  collapsedOnLoad: boolean;
  modulesNames: string[];
}

/**
 * Display Condition configuration
 */
export interface DisplayCondition {
  type: string;
  label: string;
  description?: string;
  before: string;
  after: string;
}

/**
 * Rows Configuration
 */
export interface RowsConfiguration {
  emptyRows?: boolean;
  defaultRows?: BeefreeRow[];
  externalContentURLs?: Array<{
    name: string;
    value: string;
  }>;
}

/**
 * Merge Tag configuration
 */
export interface MergeTag {
  name: string;
  value: string;
  previewValue?: string;
}

/**
 * Template data structure (from Template Catalog API)
 */
export interface TemplateData {
  id: string;
  name: string;
  title?: string;
  display_name?: string;
  json_data?: BeefreeTemplateJson;
  category?: string;
  collection?: string;
  designer?: string;
  tags?: string[];
  thumbnail?: string;
  data?: unknown;
}


