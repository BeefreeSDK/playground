interface ExportConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ExportConfirmModal: React.FC<ExportConfirmModalProps> = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content export-confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Heads-up</h2>
          <button className="modal-close" onClick={onCancel}>×</button>
        </div>

        <div className="modal-body">
          <p>This simple playground is just for demo purposes and will export the original template.</p>
          <p>Any changes you made in the editor will <strong>not</strong> be included in the export.</p>
          <p>Why don't you <a href="https://developers.beefree.io/signup?utm_source=sdk&utm_medium=internal&utm_campaign=sdkplayground&utm_content=signup" target="_blank" rel="noopener noreferrer">sign up for a free Beefree SDK account</a> and set up a test integration?</p>
        </div>

        <div className="modal-footer">
          <button onClick={onCancel} className="btn-secondary">Cancel</button>
          <button onClick={onConfirm} className="btn-primary">Export</button>
        </div>
      </div>
    </div>
  );
};

export default ExportConfirmModal;
