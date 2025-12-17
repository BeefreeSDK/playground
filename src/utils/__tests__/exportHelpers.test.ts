import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getTemplateId,
  validateTemplateId,
  showExportWarning,
  handleExportError,
  getTemplateDisplayName,
} from '../exportHelpers';
import type { TemplateData } from '../../types/beefree';

describe('exportHelpers utility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTemplateId', () => {
    it('should extract template ID from selectedTemplate', () => {
      const template: TemplateData = {
        id: 'template-123',
        name: 'Test Template',
        title: 'Test',
        data: { templateId: 'template-123' },
      };

      const result = getTemplateId(template);
      expect(result).toBe('template-123');
    });

    it('should return null when template is null', () => {
      const result = getTemplateId(null);
      expect(result).toBeNull();
    });

    it('should return null when data is missing', () => {
      const template: TemplateData = {
        id: 'template-123',
        name: 'Test Template',
        title: 'Test',
        data: undefined as any,
      };

      const result = getTemplateId(template);
      expect(result).toBeNull();
    });

    it('should return null when templateId is missing from data', () => {
      const template: TemplateData = {
        id: 'template-123',
        name: 'Test Template',
        title: 'Test',
        data: {},
      };

      const result = getTemplateId(template);
      expect(result).toBeNull();
    });
  });

  describe('validateTemplateId', () => {
    it('should return true for valid template ID', () => {
      const result = validateTemplateId('template-123');
      expect(result).toBe(true);
    });

    it('should return false and alert for null template ID', () => {
      const alertSpy = vi.spyOn(global, 'alert');

      const result = validateTemplateId(null);

      expect(result).toBe(false);
      expect(alertSpy).toHaveBeenCalledWith('Template ID not found');
    });

    it('should return false and alert for empty string template ID', () => {
      const alertSpy = vi.spyOn(global, 'alert');

      const result = validateTemplateId('');

      expect(result).toBe(false);
      expect(alertSpy).toHaveBeenCalledWith('Template ID not found');
    });
  });

  describe('showExportWarning', () => {
    it('should show export warning alert and log to console', () => {
      const alertSpy = vi.spyOn(global, 'alert');
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      showExportWarning();

      expect(alertSpy).toHaveBeenCalledWith(
        '⚠️ Warning: This will export the ORIGINAL template. Any changes you made in the editor will NOT be included.'
      );
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '⚠️ Exported the original template. User edits are NOT included.'
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe('handleExportError', () => {
    it('should handle Error instance', () => {
      const alertSpy = vi.spyOn(global, 'alert');
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const error = new Error('Export failed');
      const result = handleExportError(error, 'HTML');

      expect(result).toBe('Export failed');
      expect(alertSpy).toHaveBeenCalledWith('Failed to export HTML: Export failed');
      expect(consoleErrorSpy).toHaveBeenCalledWith('HTML export error:', error);

      consoleErrorSpy.mockRestore();
    });

    it('should handle unknown error', () => {
      const alertSpy = vi.spyOn(global, 'alert');
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = handleExportError('Some error string', 'PDF');

      expect(result).toBe('Unknown error');
      expect(alertSpy).toHaveBeenCalledWith('Failed to export PDF: Unknown error');
      expect(consoleErrorSpy).toHaveBeenCalledWith('PDF export error:', 'Some error string');

      consoleErrorSpy.mockRestore();
    });
  });

  describe('getTemplateDisplayName', () => {
    it('should return display_name when available', () => {
      const template: TemplateData = {
        id: 'template-123',
        name: 'Name',
        display_name: 'Display Name',
        title: 'Title',
        data: {},
      };

      const result = getTemplateDisplayName(template);
      expect(result).toBe('Display Name');
    });

    it('should return name when display_name is missing', () => {
      const template: TemplateData = {
        id: 'template-123',
        name: 'Name',
        title: 'Title',
        data: {},
      };

      const result = getTemplateDisplayName(template);
      expect(result).toBe('Name');
    });

    it('should return title when display_name and name are missing', () => {
      const template: TemplateData = {
        id: 'template-123',
        title: 'Title',
        data: {},
      } as any;

      const result = getTemplateDisplayName(template);
      expect(result).toBe('Title');
    });

    it('should return "Untitled Template" when all fields are missing', () => {
      const template: TemplateData = {
        id: 'template-123',
        data: {},
      } as any;

      const result = getTemplateDisplayName(template);
      expect(result).toBe('Untitled Template');
    });
  });
});
