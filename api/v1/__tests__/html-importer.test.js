import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import handler from '../html-importer.js';

vi.mock('axios');

describe('html-importer endpoint', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    vi.clearAllMocks();

    mockReq = {
      method: 'POST',
      body: { html: '<html><body>User HTML that will be ignored</body></html>' },
    };

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    // Set environment variables
    process.env.HTML_IMPORTER_API_KEY = 'test-api-key';

    // Mock console.log to suppress output during tests
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('should return 405 for non-POST requests', async () => {
    mockReq.method = 'GET';

    await handler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(405);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Method not allowed' });
  });

  it('should return 500 if HTML_IMPORTER_API_KEY is not configured', async () => {
    delete process.env.HTML_IMPORTER_API_KEY;

    await handler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'HTML Importer API Key not configured' });
  });

  it('should convert hardcoded sample HTML successfully', async () => {
    const mockConvertedJson = {
      data: {
        page: {
          body: { content: {} },
          rows: [],
        },
      },
    };

    axios.post.mockResolvedValue(mockConvertedJson);

    await handler(mockReq, mockRes);

    // Should call axios with hardcoded HTML (not from request body)
    expect(axios.post).toHaveBeenCalledWith(
      'https://api.getbee.io/v1/conversion/html-to-json',
      expect.stringContaining('<!DOCTYPE html>'), // Hardcoded sample HTML
      {
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'text/html',
        },
        timeout: 15000,
        maxContentLength: 5 * 1024 * 1024,
        maxBodyLength: 5 * 1024 * 1024,
      }
    );

    expect(mockRes.json).toHaveBeenCalledWith(mockConvertedJson.data);
  });

  it('should ignore user-provided HTML and only convert hardcoded sample', async () => {
    const mockConvertedJson = { data: { page: {} } };
    axios.post.mockResolvedValue(mockConvertedJson);

    mockReq.body = { html: '<html><body>Malicious HTML</body></html>' };

    await handler(mockReq, mockRes);

    // Verify the hardcoded sample HTML is used (starts with <!DOCTYPE html>)
    const calledHtml = axios.post.mock.calls[0][1];
    expect(calledHtml).toContain('<!DOCTYPE html>');
    expect(calledHtml).toContain('Beefree SDK Newsletter');
    expect(calledHtml).not.toContain('Malicious HTML');
  });

  it('should handle 413 Payload Too Large error', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const error = new Error('Payload too large');
    error.response = { status: 413, data: {} };
    axios.post.mockRejectedValue(error);

    await handler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(413);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'HTML content too large' });

    consoleErrorSpy.mockRestore();
  });

  it('should handle 422 Invalid HTML error', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const error = new Error('Invalid HTML');
    error.response = {
      status: 422,
      data: { message: 'HTML syntax error' },
    };
    axios.post.mockRejectedValue(error);

    await handler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(422);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Invalid HTML format. Please check the HTML content.',
    });

    consoleErrorSpy.mockRestore();
  });

  it('should handle timeout error (ECONNABORTED)', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const error = new Error('Timeout');
    error.code = 'ECONNABORTED';
    axios.post.mockRejectedValue(error);

    await handler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(408);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Request timeout - HTML processing took too long' });

    consoleErrorSpy.mockRestore();
  });

  it('should handle general errors', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const error = new Error('Network error');
    axios.post.mockRejectedValue(error);

    await handler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Failed to import HTML',
    });

    consoleErrorSpy.mockRestore();
  });

  it('should use hardcoded HTML_IMPORTER_URL', async () => {
    const mockConvertedJson = { data: { page: {} } };
    axios.post.mockResolvedValue(mockConvertedJson);

    await handler(mockReq, mockRes);

    expect(axios.post).toHaveBeenCalledWith(
      'https://api.getbee.io/v1/conversion/html-to-json',
      expect.any(String),
      expect.any(Object)
    );
  });

  it('should send hardcoded sample HTML with correct structure', async () => {
    const mockConvertedJson = { data: { page: {} } };
    axios.post.mockResolvedValue(mockConvertedJson);

    await handler(mockReq, mockRes);

    const calledHtml = axios.post.mock.calls[0][1];

    // Verify sample HTML structure
    expect(calledHtml).toContain('<!DOCTYPE html>');
    expect(calledHtml).toContain('Beefree SDK Newsletter');
    expect(calledHtml).toContain('Recipe of the month');
    expect(calledHtml).toContain('Industry news');
    expect(calledHtml).toContain('Changelog highlights');
  });
});
