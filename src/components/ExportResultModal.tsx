import './ExportResultModal.css';
import { downloadText, downloadHtml } from '../utils/downloadHelpers';

/**
 * ExportResultModal Component
 * 
 * Unified modal for displaying all export results:
 * - HTML: Shows code in textarea with download button
 * - Plain Text: Shows text in textarea with download button
 * - PDF: Shows "Open PDF" link
 * - Image: Shows thumbnail preview with download button
 * 
 * Also shows loading states:
 * - "Exporting HTML..."
 * - "Exporting Plain Text..."
 * - "Creating PDF..."
 * - "Creating Thumbnail..."
 */

interface ExportResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'html' | 'plain-text' | 'pdf' | 'image' | null;
  content?: string; // For HTML and Plain Text exports
  imageUrl?: string; // Blob URL for image export
  pdfUrl?: string; // Download URL for PDF export
  loading?: boolean; // Show loading state during export
}

const ExportResultModal: React.FC<ExportResultModalProps> = ({
  isOpen,
  onClose,
  type,
  content,
  imageUrl,
  pdfUrl,
  loading
}) => {
  if (!isOpen) return null;

  /**
   * Get modal title based on export type and loading state
   */
  const getTitle = () => {
    if (loading) {
      switch (type) {
        case 'html': return 'Exporting HTML...';
        case 'plain-text': return 'Exporting Plain Text...';
        case 'pdf': return 'Creating PDF...';
        case 'image': return 'Creating Thumbnail...';
        default: return 'Exporting...';
      }
    }
    
    switch (type) {
      case 'html': return 'HTML Export';
      case 'plain-text': return 'Plain Text Export';
      case 'pdf': return 'PDF Export';
      case 'image': return 'Thumbnail Export';
      default: return 'Export Result';
    }
  };

  const handleDownloadImage = () => {
    if (imageUrl) {
      // For image URLs (blob URLs), we can directly download using the generic utility
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'template-thumbnail.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content export-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{getTitle()}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="export-loading">
              <div className="loading-spinner-large">⟳</div>
              <p>Please wait...</p>
            </div>
          ) : (
            <>
              {(type === 'html' || type === 'plain-text') && content && (
                <div className="export-text-content">
                  <textarea
                    value={content}
                    readOnly
                    className="export-textarea"
                    rows={20}
                  />
                </div>
              )}

              {type === 'image' && imageUrl && (
                <div className="export-image-content">
                  <img src={imageUrl} alt="Template thumbnail" className="export-thumbnail" />
                </div>
              )}

              {type === 'pdf' && pdfUrl && (
                <div className="export-pdf-content">
                  <p>Your PDF has been generated successfully!</p>
                  <a href={pdfUrl} target="_blank" rel="noreferrer" className="pdf-open-link">
                    Open PDF in New Tab
                  </a>
                </div>
              )}
            </>
          )}
        </div>

        {!loading && (
          <div className="modal-footer">
            {(type === 'html' || type === 'plain-text') && content && (
              <button
                onClick={() => {
                  if (type === 'html') {
                    downloadHtml(content, 'template.html');
                  } else {
                    downloadText(content, 'template.txt');
                  }
                }}
                className="btn-primary"
              >
                Download {type === 'html' ? 'HTML' : 'Text'}
              </button>
            )}

            {type === 'image' && imageUrl && (
              <button onClick={handleDownloadImage} className="btn-primary">
                Download Image
              </button>
            )}

            <button onClick={onClose} className="btn-secondary">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportResultModal;

