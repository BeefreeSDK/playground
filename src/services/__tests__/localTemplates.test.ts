import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  loadTemplatesIndex,
  loadTemplate,
  getTemplateHtmlUrl,
  getTemplatePlainTextUrl,
  getTemplatePdfUrl,
  getTemplateImageUrl,
  loadTemplateHtml,
  loadTemplatePlainText,
  loadAllTemplates,
} from '../localTemplates';
import { mockTemplateIndex, mockTemplate, mockHtmlContent, mockPlainTextContent } from '../../tests/mocks/handlers';

describe('localTemplates service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loadTemplatesIndex', () => {
    it('should load templates index successfully', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockTemplateIndex,
      });

      const result = await loadTemplatesIndex();

      expect(global.fetch).toHaveBeenCalledWith('/templates/index.json');
      expect(result).toEqual(mockTemplateIndex);
    });

    it('should throw error when index fails to load', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
      });

      await expect(loadTemplatesIndex()).rejects.toThrow('Failed to load templates index');
    });
  });

  describe('loadTemplate', () => {
    it('should load a specific template successfully', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockTemplate,
      });

      const result = await loadTemplate('test-template-1');

      expect(global.fetch).toHaveBeenCalledWith('/templates/test-template-1.json');
      expect(result).toEqual(mockTemplate);
    });

    it('should throw error when template fails to load', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
      });

      await expect(loadTemplate('invalid-id')).rejects.toThrow('Failed to load template: invalid-id');
    });
  });

  describe('URL generators', () => {
    it('should generate correct HTML URL', () => {
      expect(getTemplateHtmlUrl('test-template')).toBe('/templates/exports/test-template.html');
    });

    it('should generate correct plain text URL', () => {
      expect(getTemplatePlainTextUrl('test-template')).toBe('/templates/exports/test-template.txt');
    });

    it('should generate correct PDF URL', () => {
      expect(getTemplatePdfUrl('test-template')).toBe('/templates/exports/test-template.pdf');
    });

    it('should generate correct image URL', () => {
      expect(getTemplateImageUrl('test-template')).toBe('/templates/exports/test-template.png');
    });
  });

  describe('loadTemplateHtml', () => {
    it('should load HTML content successfully', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: async () => mockHtmlContent,
      });

      const result = await loadTemplateHtml('test-template-1');

      expect(global.fetch).toHaveBeenCalledWith('/templates/exports/test-template-1.html');
      expect(result).toBe(mockHtmlContent);
    });

    it('should throw error when HTML fails to load', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
      });

      await expect(loadTemplateHtml('invalid-id')).rejects.toThrow('Failed to load HTML for template: invalid-id');
    });
  });

  describe('loadTemplatePlainText', () => {
    it('should load plain text content successfully', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: async () => mockPlainTextContent,
      });

      const result = await loadTemplatePlainText('test-template-1');

      expect(global.fetch).toHaveBeenCalledWith('/templates/exports/test-template-1.txt');
      expect(result).toBe(mockPlainTextContent);
    });

    it('should throw error when plain text fails to load', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
      });

      await expect(loadTemplatePlainText('invalid-id')).rejects.toThrow('Failed to load plain text for template: invalid-id');
    });
  });

  describe('loadAllTemplates', () => {
    it('should load all templates metadata', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockTemplateIndex,
      });

      const result = await loadAllTemplates();

      expect(result).toEqual([
        { id: 'test-template-1', name: 'Test Template 1' },
        { id: 'test-template-2', name: 'Test Template 2' },
      ]);
    });
  });
});
