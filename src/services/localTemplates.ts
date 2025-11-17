/**
 * Local Templates Service
 *
 * Loads templates from static JSON files (no API calls)
 * All exports (HTML, PDF, Image, Plain Text) are pre-generated static files
 */

export interface LocalTemplate {
  id: string;
  name: string;
  display_name?: string;
  title?: string;
  category?: string;
  collection?: string;
  designer?: string;
  tags?: string[];
  thumbnail?: string;
  json_data: any; // Beefree template JSON
}

export interface TemplatesIndex {
  templates: Array<{
    id: string;
    name: string;
    files: {
      json: string;
      html: string;
      text: string;
      pdf: string | null;
      image: string | null;
    };
  }>;
  total: number;
  exported_at: string;
}

/**
 * Load the templates index file
 */
export async function loadTemplatesIndex(): Promise<TemplatesIndex> {
  const response = await fetch('/templates/index.json');
  if (!response.ok) {
    throw new Error('Failed to load templates index');
  }
  return response.json();
}

/**
 * Load a specific template's JSON data by ID
 */
export async function loadTemplate(templateId: string): Promise<LocalTemplate> {
  const response = await fetch(`/templates/${templateId}.json`);
  if (!response.ok) {
    throw new Error(`Failed to load template: ${templateId}`);
  }
  return response.json();
}

/**
 * Get the URL for a template's HTML export
 */
export function getTemplateHtmlUrl(templateId: string): string {
  return `/templates/exports/${templateId}.html`;
}

/**
 * Get the URL for a template's plain text export
 */
export function getTemplatePlainTextUrl(templateId: string): string {
  return `/templates/exports/${templateId}.txt`;
}

/**
 * Get the URL for a template's PDF export
 */
export function getTemplatePdfUrl(templateId: string): string {
  return `/templates/exports/${templateId}.pdf`;
}

/**
 * Get the URL for a template's image export
 */
export function getTemplateImageUrl(templateId: string): string {
  return `/templates/exports/${templateId}.png`;
}

/**
 * Load HTML content for a template
 */
export async function loadTemplateHtml(templateId: string): Promise<string> {
  const response = await fetch(getTemplateHtmlUrl(templateId));
  if (!response.ok) {
    throw new Error(`Failed to load HTML for template: ${templateId}`);
  }
  return response.text();
}

/**
 * Load plain text content for a template
 */
export async function loadTemplatePlainText(templateId: string): Promise<string> {
  const response = await fetch(getTemplatePlainTextUrl(templateId));
  if (!response.ok) {
    throw new Error(`Failed to load plain text for template: ${templateId}`);
  }
  return response.text();
}

/**
 * Load all templates (metadata only, without full JSON)
 */
export async function loadAllTemplates(): Promise<Array<{ id: string; name: string }>> {
  const index = await loadTemplatesIndex();
  return index.templates.map(t => ({
    id: t.id,
    name: t.name
  }));
}
