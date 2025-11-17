import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ExportResultModal from '../ExportResultModal';

describe('ExportResultModal component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    render(
      <ExportResultModal
        isOpen={false}
        onClose={vi.fn()}
        type="html"
        content="<html></html>"
      />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  describe('HTML export', () => {
    it('should render HTML export modal', () => {
      const mockContent = '<html><body>Test</body></html>';

      render(
        <ExportResultModal
          isOpen={true}
          onClose={vi.fn()}
          type="html"
          content={mockContent}
        />
      );

      expect(screen.getByText('HTML Export')).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockContent)).toBeInTheDocument();
    });

    it('should show loading state for HTML export', () => {
      render(
        <ExportResultModal
          isOpen={true}
          onClose={vi.fn()}
          type="html"
          loading={true}
        />
      );

      expect(screen.getByText('Exporting HTML...')).toBeInTheDocument();
      expect(screen.getByText('Please wait...')).toBeInTheDocument();
    });

    it('should have download button for HTML export', () => {
      render(
        <ExportResultModal
          isOpen={true}
          onClose={vi.fn()}
          type="html"
          content="<html></html>"
        />
      );

      expect(screen.getByText('Download HTML')).toBeInTheDocument();
    });

    it('should download HTML when download button is clicked', () => {
      const createElementSpy = vi.spyOn(document, 'createElement');
      const mockContent = '<html><body>Test</body></html>';

      render(
        <ExportResultModal
          isOpen={true}
          onClose={vi.fn()}
          type="html"
          content={mockContent}
        />
      );

      const downloadButton = screen.getByText('Download HTML');
      fireEvent.click(downloadButton);

      expect(createElementSpy).toHaveBeenCalledWith('a');
    });
  });

  describe('Plain Text export', () => {
    it('should render plain text export modal', () => {
      const mockContent = 'Plain text content';

      render(
        <ExportResultModal
          isOpen={true}
          onClose={vi.fn()}
          type="plain-text"
          content={mockContent}
        />
      );

      expect(screen.getByText('Plain Text Export')).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockContent)).toBeInTheDocument();
    });

    it('should show loading state for plain text export', () => {
      render(
        <ExportResultModal
          isOpen={true}
          onClose={vi.fn()}
          type="plain-text"
          loading={true}
        />
      );

      expect(screen.getByText('Exporting Plain Text...')).toBeInTheDocument();
    });

    it('should have download button for plain text export', () => {
      render(
        <ExportResultModal
          isOpen={true}
          onClose={vi.fn()}
          type="plain-text"
          content="Plain text"
        />
      );

      expect(screen.getByText('Download Text')).toBeInTheDocument();
    });
  });

  describe('PDF export', () => {
    it('should render PDF export modal', () => {
      render(
        <ExportResultModal
          isOpen={true}
          onClose={vi.fn()}
          type="pdf"
          pdfUrl="https://example.com/template.pdf"
        />
      );

      expect(screen.getByText('PDF Export')).toBeInTheDocument();
      expect(screen.getByText('Your PDF has been generated successfully!')).toBeInTheDocument();
    });

    it('should show loading state for PDF export', () => {
      render(
        <ExportResultModal
          isOpen={true}
          onClose={vi.fn()}
          type="pdf"
          loading={true}
        />
      );

      expect(screen.getByText('Creating PDF...')).toBeInTheDocument();
    });

    it('should have link to open PDF', () => {
      const pdfUrl = 'https://example.com/template.pdf';

      render(
        <ExportResultModal
          isOpen={true}
          onClose={vi.fn()}
          type="pdf"
          pdfUrl={pdfUrl}
        />
      );

      const link = screen.getByText('Open PDF in New Tab');
      expect(link).toHaveAttribute('href', pdfUrl);
      expect(link).toHaveAttribute('target', '_blank');
    });
  });

  describe('Image export', () => {
    it('should render image export modal', () => {
      render(
        <ExportResultModal
          isOpen={true}
          onClose={vi.fn()}
          type="image"
          imageUrl="blob:mock-url"
        />
      );

      expect(screen.getByText('Thumbnail Export')).toBeInTheDocument();
      expect(screen.getByAltText('Template thumbnail')).toBeInTheDocument();
    });

    it('should show loading state for image export', () => {
      render(
        <ExportResultModal
          isOpen={true}
          onClose={vi.fn()}
          type="image"
          loading={true}
        />
      );

      expect(screen.getByText('Creating Thumbnail...')).toBeInTheDocument();
    });

    it('should have download button for image export', () => {
      render(
        <ExportResultModal
          isOpen={true}
          onClose={vi.fn()}
          type="image"
          imageUrl="blob:mock-url"
        />
      );

      expect(screen.getByText('Download Image')).toBeInTheDocument();
    });

    it('should display image with correct src', () => {
      const imageUrl = 'blob:mock-url-123';

      render(
        <ExportResultModal
          isOpen={true}
          onClose={vi.fn()}
          type="image"
          imageUrl={imageUrl}
        />
      );

      const img = screen.getByAltText('Template thumbnail');
      expect(img).toHaveAttribute('src', imageUrl);
    });
  });

  describe('Modal interactions', () => {
    it('should call onClose when close button is clicked', () => {
      const onCloseMock = vi.fn();

      render(
        <ExportResultModal
          isOpen={true}
          onClose={onCloseMock}
          type="html"
          content="<html></html>"
        />
      );

      const closeButton = screen.getByText('×');
      fireEvent.click(closeButton);

      expect(onCloseMock).toHaveBeenCalled();
    });

    it('should call onClose when Close button in footer is clicked', () => {
      const onCloseMock = vi.fn();

      render(
        <ExportResultModal
          isOpen={true}
          onClose={onCloseMock}
          type="html"
          content="<html></html>"
        />
      );

      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);

      expect(onCloseMock).toHaveBeenCalled();
    });

    it('should call onClose when clicking overlay', () => {
      const onCloseMock = vi.fn();

      const { container } = render(
        <ExportResultModal
          isOpen={true}
          onClose={onCloseMock}
          type="html"
          content="<html></html>"
        />
      );

      const overlay = container.querySelector('.modal-overlay');
      fireEvent.click(overlay!);

      expect(onCloseMock).toHaveBeenCalled();
    });

    it('should not call onClose when clicking modal content', () => {
      const onCloseMock = vi.fn();

      const { container } = render(
        <ExportResultModal
          isOpen={true}
          onClose={onCloseMock}
          type="html"
          content="<html></html>"
        />
      );

      const modalContent = container.querySelector('.modal-content');
      fireEvent.click(modalContent!);

      expect(onCloseMock).not.toHaveBeenCalled();
    });

    it('should not show footer buttons when loading', () => {
      render(
        <ExportResultModal
          isOpen={true}
          onClose={vi.fn()}
          type="html"
          loading={true}
        />
      );

      expect(screen.queryByText('Download HTML')).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
    });
  });
});
