/**
 * Download Helpers
 *
 * Generic utility functions for downloading files from the browser
 */

/**
 * Generic download function that works for both text and binary content
 *
 * @param content - The content to download (string, Blob, or URL)
 * @param filename - The name of the file to download
 * @param contentType - Optional MIME type (only used for string content)
 */
export function downloadFile(
  content: string | Blob,
  filename: string,
  contentType?: string
): void {
  // Create blob if content is string
  const blob = content instanceof Blob
    ? content
    : new Blob([content], { type: contentType || 'text/plain' });

  // Create download URL
  const url = URL.createObjectURL(blob);

  // Create temporary link element
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;

  // Trigger download
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Download text content as a file
 *
 * @param text - The text content to download
 * @param filename - The name of the file to download
 */
export function downloadText(text: string, filename: string): void {
  downloadFile(text, filename, 'text/plain');
}

/**
 * Download HTML content as a file
 *
 * @param html - The HTML content to download
 * @param filename - The name of the file to download
 */
export function downloadHtml(html: string, filename: string): void {
  downloadFile(html, filename, 'text/html');
}

