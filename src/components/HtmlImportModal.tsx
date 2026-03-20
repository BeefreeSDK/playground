import { useState, useEffect } from 'react';

/**
 * HtmlImportModal Component
 *
 * Simplified modal that loads a pre-defined sample newsletter template
 *
 * Features:
 * - Shows sample HTML preview (read-only, greyed out)
 * - "Load Sample HTML" button to import newsletter
 * - Backend converts the pre-defined sample HTML to Beefree JSON
 * - Automatically loads converted template into editor
 */

interface HtmlImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: () => Promise<void>;
}

const HtmlImportModal: React.FC<HtmlImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [isImporting, setIsImporting] = useState(false); // Loading state during API call
  const [error, setError] = useState(''); // Error message
  const [sampleHtml, setSampleHtml] = useState(''); // Sample HTML for preview

  // Fetch sample HTML for preview when modal opens
  useEffect(() => {
    if (isOpen && !sampleHtml) {
      fetch('/sample-newsletter.html')
        .then(res => res.text())
        .then(setSampleHtml)
        .catch(() => setSampleHtml('Failed to load sample HTML preview.'));
    }
  }, [isOpen, sampleHtml]);

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
   * Calls backend which converts the pre-defined sample HTML to Beefree JSON
   * Parent component loads JSON into editor
   */
  const handleLoadSample = async () => {
    setIsImporting(true);
    setError('');

    try {
      await onImport();
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
      <div className="modal-container">
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
              value={sampleHtml}
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
