import type { TemplateData } from '../types/beefree';
import { STATIC_EXPORT_WARNING, STATIC_EXPORT_CONSOLE_WARNING, logger } from '../constants';

export function getTemplateId(selectedTemplate: TemplateData | null): string | null {
  if (!selectedTemplate?.data || typeof selectedTemplate.data !== 'object') {
    return null;
  }
  const data = selectedTemplate.data as { templateId?: string };
  return data.templateId || null;
}

export function validateTemplateId(templateId: string | null): boolean {
  if (!templateId) {
    alert('Template ID not found');
    return false;
  }
  return true;
}

export function showExportWarning(): void {
  alert(STATIC_EXPORT_WARNING);
  logger.warn(STATIC_EXPORT_CONSOLE_WARNING);
}

export function handleExportError(err: unknown, exportType: string): string {
  const errorMessage = err instanceof Error ? err.message : 'Unknown error';
  logger.error(`${exportType} export error:`, err);
  const alertMessage = `Failed to export ${exportType}: ${errorMessage}`;
  alert(alertMessage);
  return errorMessage;
}

export function getTemplateDisplayName(template: TemplateData): string {
  return template.display_name || template.name || template.title || 'Untitled Template';
}
