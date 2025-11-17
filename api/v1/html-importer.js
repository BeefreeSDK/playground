import axios from 'axios';

/**
 * HTML Importer Endpoint
 * 
 * POST /v1/html-importer
 * 
 * Purpose: Convert raw HTML emails to Beefree-compatible JSON
 * 
 * Request Body:
 *   { html: '<html>...</html>' }
 * 
 * Response: Beefree template JSON
 * 
 * Environment Variables Required:
 *   - HTML_IMPORTER_API_KEY
 * 
 * External API: https://api.getbee.io/v1/conversion/html-to-json
 * Content-Type: text/html (NOT application/json!)
 * 
 * Security:
 * - Sanitizes HTML to remove scripts, iframes, event handlers
 * - 500KB size limit
 * - 30 second timeout
 */

/**
 * HTML Sanitization Function
 * Removes potentially dangerous HTML elements and attributes
 */
const sanitizeHtml = (html) => {
  if (typeof html !== 'string') {
    return { content: '', wasModified: false };
  }

  const originalLength = html.length;
  let sanitized = html;

  // Remove script tags
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove iframe tags
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  
  // Remove javascript: URLs
  sanitized = sanitized.replace(/javascript:[^\s"']+/gi, '');
  
  // Remove data: URLs that could be harmful (keep image data URLs)
  sanitized = sanitized.replace(/data:(?!image\/)[^\s"']+/gi, '');
  
  // Remove event handlers
  const eventHandlers = [
    'onabort', 'onblur', 'onchange', 'onclick', 'ondblclick', 'onerror', 'onfocus',
    'onkeydown', 'onkeypress', 'onkeyup', 'onload', 'onmousedown', 'onmousemove',
    'onmouseout', 'onmouseover', 'onmouseup', 'onreset', 'onresize', 'onscroll',
    'onselect', 'onsubmit', 'onunload'
  ];

  eventHandlers.forEach(handler => {
    const regex = new RegExp(` ${handler}="[^"]*"| ${handler}='[^']*'| ${handler}=[^ >]*`, 'gi');
    sanitized = sanitized.replace(regex, '');
  });

  return {
    content: sanitized,
    wasModified: originalLength !== sanitized.length
  };
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const HTML_IMPORTER_API_KEY = process.env.HTML_IMPORTER_API_KEY;
    const HTML_IMPORTER_URL = process.env.HTML_IMPORTER_URL || 'https://api.getbee.io/v1/conversion/html-to-json';

    if (!HTML_IMPORTER_API_KEY) {
      return res.status(500).json({ error: 'HTML Importer API Key not configured' });
    }

    const { html } = req.body;
    
    if (!html || typeof html !== 'string') {
      return res.status(400).json({ error: 'HTML content is required' });
    }

    console.log('Processing HTML import request...');
    console.log('HTML content length:', html.length, 'characters');

    // Sanitize HTML
    const sanitizationResult = sanitizeHtml(html);
    const sanitizedHtml = sanitizationResult.content;

    if (sanitizedHtml.length > 500000) { // 500KB limit
      return res.status(413).json({ error: 'HTML content too large (max 500KB)' });
    }

    // Call Beefree HTML Importer API
    const response = await axios.post(
      HTML_IMPORTER_URL,
      sanitizedHtml,
      {
        headers: {
          'Authorization': `Bearer ${HTML_IMPORTER_API_KEY}`,
          'Content-Type': 'text/html'
        },
        timeout: 30000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
    );

    console.log('HTML import successful');
    res.json(response.data);
  } catch (error) {
    console.error('HTML import error:', error.response?.data || error.message);
    
    if (error.response?.status === 413) {
      res.status(413).json({ error: 'HTML content too large' });
    } else if (error.response?.status === 422) {
      res.status(422).json({ 
        error: 'Invalid HTML format: ' + (error.response?.data?.message || 'Please check the HTML content') 
      });
    } else if (error.code === 'ECONNABORTED') {
      res.status(408).json({ error: 'Request timeout - HTML processing took too long' });
    } else {
      res.status(500).json({ 
        error: 'Failed to import HTML: ' + (error.response?.data?.message || error.message) 
      });
    }
  }
}

