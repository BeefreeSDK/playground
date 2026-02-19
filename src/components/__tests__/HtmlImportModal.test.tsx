import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HtmlImportModal from '../HtmlImportModal';
import { SAMPLE_NEWSLETTER_HTML } from '../sampleHtml';

describe('HtmlImportModal component', () => {
  const mockOnClose = vi.fn();
  const mockOnImport = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    render(
      <HtmlImportModal
        isOpen={false}
        onClose={mockOnClose}
        onImport={mockOnImport}
      />
    );

    expect(screen.queryByText('Import Sample HTML')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(
      <HtmlImportModal
        isOpen={true}
        onClose={mockOnClose}
        onImport={mockOnImport}
      />
    );

    expect(screen.getByText('Import Sample HTML')).toBeInTheDocument();
    expect(screen.getByText('Load Sample HTML')).toBeInTheDocument();
  });

  it('should display sample HTML in textarea', () => {
    render(
      <HtmlImportModal
        isOpen={true}
        onClose={mockOnClose}
        onImport={mockOnImport}
      />
    );

    const textarea = screen.getByLabelText('Sample HTML Preview') as HTMLTextAreaElement;
    expect(textarea).toBeInTheDocument();
    expect(textarea.value).toBe(SAMPLE_NEWSLETTER_HTML);
    expect(textarea).toHaveAttribute('readonly');
    expect(textarea).toBeDisabled();
  });

  it('should call onImport when Load Sample HTML button is clicked', async () => {
    mockOnImport.mockResolvedValue(undefined);

    render(
      <HtmlImportModal
        isOpen={true}
        onClose={mockOnClose}
        onImport={mockOnImport}
      />
    );

    const loadButton = screen.getByText('Load Sample HTML');
    fireEvent.click(loadButton);

    await waitFor(() => {
      expect(mockOnImport).toHaveBeenCalledWith(SAMPLE_NEWSLETTER_HTML);
    });
  });

  it('should close modal after successful import', async () => {
    mockOnImport.mockResolvedValue(undefined);

    render(
      <HtmlImportModal
        isOpen={true}
        onClose={mockOnClose}
        onImport={mockOnImport}
      />
    );

    const loadButton = screen.getByText('Load Sample HTML');
    fireEvent.click(loadButton);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('should show loading state during import', async () => {
    mockOnImport.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(
      <HtmlImportModal
        isOpen={true}
        onClose={mockOnClose}
        onImport={mockOnImport}
      />
    );

    const loadButton = screen.getByText('Load Sample HTML');
    fireEvent.click(loadButton);

    expect(screen.getByText('Importing...')).toBeInTheDocument();

    // Buttons should be disabled during import
    expect(loadButton).toBeDisabled();
    expect(screen.getByText('Cancel')).toBeDisabled();
  });

  it('should display error message on import failure', async () => {
    const errorMessage = 'Import failed';
    mockOnImport.mockRejectedValue(new Error(errorMessage));

    render(
      <HtmlImportModal
        isOpen={true}
        onClose={mockOnClose}
        onImport={mockOnImport}
      />
    );

    const loadButton = screen.getByText('Load Sample HTML');
    fireEvent.click(loadButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    // Modal should not close on error
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should handle unknown error type', async () => {
    mockOnImport.mockRejectedValue('Unknown error');

    render(
      <HtmlImportModal
        isOpen={true}
        onClose={mockOnClose}
        onImport={mockOnImport}
      />
    );

    const loadButton = screen.getByText('Load Sample HTML');
    fireEvent.click(loadButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to import HTML')).toBeInTheDocument();
    });
  });

  it('should call onClose when close button is clicked', () => {
    render(
      <HtmlImportModal
        isOpen={true}
        onClose={mockOnClose}
        onImport={mockOnImport}
      />
    );

    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should call onClose when Cancel button is clicked', () => {
    render(
      <HtmlImportModal
        isOpen={true}
        onClose={mockOnClose}
        onImport={mockOnImport}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should not close when clicking close button during import', async () => {
    mockOnImport.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(
      <HtmlImportModal
        isOpen={true}
        onClose={mockOnClose}
        onImport={mockOnImport}
      />
    );

    const loadButton = screen.getByText('Load Sample HTML');
    fireEvent.click(loadButton);

    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should close modal on Escape key press', () => {
    render(
      <HtmlImportModal
        isOpen={true}
        onClose={mockOnClose}
        onImport={mockOnImport}
      />
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should not close on Escape key press during import', async () => {
    mockOnImport.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(
      <HtmlImportModal
        isOpen={true}
        onClose={mockOnClose}
        onImport={mockOnImport}
      />
    );

    const loadButton = screen.getByText('Load Sample HTML');
    fireEvent.click(loadButton);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should clear error when closing modal', () => {
    const errorMessage = 'Import failed';
    mockOnImport.mockRejectedValue(new Error(errorMessage));

    const { rerender } = render(
      <HtmlImportModal
        isOpen={true}
        onClose={mockOnClose}
        onImport={mockOnImport}
      />
    );

    const loadButton = screen.getByText('Load Sample HTML');
    fireEvent.click(loadButton);

    // Wait for error to appear, then close and reopen
    waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    // Simulate closing and reopening
    rerender(
      <HtmlImportModal
        isOpen={false}
        onClose={mockOnClose}
        onImport={mockOnImport}
      />
    );

    rerender(
      <HtmlImportModal
        isOpen={true}
        onClose={mockOnClose}
        onImport={mockOnImport}
      />
    );

    // Error should be cleared
    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
  });
});
