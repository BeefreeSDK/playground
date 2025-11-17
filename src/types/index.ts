// Re-export Beefree types
export type {
  BeefreeTemplateJson,
  BeefreeConfig,
  TemplateData,
  BeefreeSDKInstance,
  ChangeResponse,
  ModuleGroup
} from './beefree';

// Template Catalog API Types
export interface Template {
  id: string;
  name: string;
  title?: string;
  display_name?: string;
  json_data?: unknown; // Use BeefreeTemplateJson for specific typing
  category?: string;
  collection?: string;
  designer?: string;
  tags?: string[];
  thumbnail?: string;
  data?: unknown;
}

export interface Category {
  id: string;
  name: string;
}

export interface Collection {
  id: string;
  name: string;
}

export interface Designer {
  id: string;
  name: string;
}

export interface Tag {
  id: string;
  name: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success?: boolean;
  error?: string;
}

export interface TemplatesResponse {
  templates: Template[];
  total?: number;
  limit?: number;
  offset?: number;
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface CollectionsResponse {
  collections: Collection[];
}

export interface DesignersResponse {
  designers: Designer[];
}

export interface TagsResponse {
  tags: Tag[];
}

// Beefree SDK Types
// Note: BeefreeConfig is exported from './beefree' above
