import { useState, useRef, useEffect } from 'react';
import { SAMPLE_NEWSLETTER_HTML } from './sampleHtml';

/**
 * HtmlImportModal Component
 * 
 * Simplified modal that loads a pre-defined sample newsletter template
 * 
 * Features:
 * - Shows sample HTML preview (read-only, greyed out)
 * - "Load Sample HTML" button to import newsletter
 * - Sends HTML to HTML Importer API which converts to Beefree JSON
 * - Automatically loads converted template into editor
 * 
 * Sample HTML:
 * - Full newsletter template with multiple sections
 * - No images (uses emoji icons to avoid conversion issues)
 * - Beefree purple branding (#7747ff)
 */

interface HtmlImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (html: string) => Promise<void>;
}

const HtmlImportModal: React.FC<HtmlImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [isImporting, setIsImporting] = useState(false); // Loading state during API call
  const [error, setError] = useState(''); // Error message
  const modalRef = useRef<HTMLDivElement>(null); // Ref for click-outside detection

  const handleClose = () => {
    if (!isImporting) {
      setError('');
      onClose();
    }
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isImporting) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, isImporting]);

  /**
   * Load Sample HTML Handler
   * Sends newsletter HTML to HTML Importer API
   * API converts HTML → Beefree JSON
   * Parent component loads JSON into editor
   */
  const handleLoadSample = async () => {
    setIsImporting(true);
    setError('');

    try {
      await onImport(SAMPLE_NEWSLETTER_HTML);
      onClose();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import HTML';
      setError(errorMessage);
    } finally {
      setIsImporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container" ref={modalRef}>
        <div className="modal-header">
          <h2>Import Sample HTML</h2>
          <button 
            onClick={handleClose}
            disabled={isImporting}
            className="modal-close-button"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="modal-content">
          <div className="import-instructions">
            <p>Click the button below to load a sample newsletter template into the editor.</p>
          </div>

          <div className="html-input-container">
            <label htmlFor="html-content" className="input-label">
              Sample HTML Preview
            </label>
            <textarea
              id="html-content"
              value={SAMPLE_NEWSLETTER_HTML}
              readOnly
              className="html-textarea html-textarea-readonly"
              disabled
            />
          </div>

          {error && (
            <div className="import-error">
              <span>{error}</span>
            </div>
          )}

          <div className="modal-actions">
            <button 
              type="button" 
              onClick={handleClose}
              disabled={isImporting}
              className="cancel-button"
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={handleLoadSample}
              disabled={isImporting}
              className="import-button"
            >
              {isImporting ? 'Importing...' : 'Load Sample HTML'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HtmlImportModal;
