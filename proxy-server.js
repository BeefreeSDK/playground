import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
// Increase payload limit for large template JSON data
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.text({ type: ['text/*', 'application/xhtml+xml', 'application/xml'], limit: '50mb' }));

const BEE_CLIENT_ID = process.env.BEE_CLIENT_ID;
const BEE_CLIENT_SECRET = process.env.BEE_CLIENT_SECRET;
const TEMPLATE_CATALOG_API_URL = process.env.TEMPLATE_CATALOG_API_URL || 'https://api.getbee.io/v1/catalog';
const TEMPLATE_CATALOG_API_TOKEN = process.env.TEMPLATE_CATALOG_API_TOKEN;
const HTML_IMPORTER_API_KEY = process.env.HTML_IMPORTER_API_KEY;
const HTML_IMPORTER_URL = process.env.HTML_IMPORTER_URL || 'https://api.getbee.io/v1/conversion/html-to-json';

// V2 Auth Endpoint
app.post('/proxy/bee-auth', async (req, res) => {
  try {
    const { uid } = req.body;
    
    const response = await axios.post(
      'https://auth.getbee.io/loginV2',
      {
        client_id: BEE_CLIENT_ID,
        client_secret: BEE_CLIENT_SECRET,
        uid: uid || 'demo-user'
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(500).json({ error: 'Failed to authenticate' });
  }
});

// Template Catalog API endpoints (note: Vite rewrites /api -> '')
app.get('/categories', async (req, res) => {
  try {
    if (!TEMPLATE_CATALOG_API_TOKEN) {
      return res.status(500).json({ error: 'Template Catalog API Token not configured' });
    }

    const response = await axios.get(`${TEMPLATE_CATALOG_API_URL}/categories`, {
      headers: {
        'Authorization': `Bearer ${TEMPLATE_CATALOG_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Categories error:', error.message);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.get('/categories/:id', async (req, res) => {
  try {
    if (!TEMPLATE_CATALOG_API_TOKEN) {
      return res.status(500).json({ error: 'Template Catalog API Token not configured' });
    }

    const { id } = req.params;
    
    const response = await axios.get(`${TEMPLATE_CATALOG_API_URL}/categories/${id}`, {
      headers: {
        'Authorization': `Bearer ${TEMPLATE_CATALOG_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Category fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

app.get('/collections', async (req, res) => {
  try {
    if (!TEMPLATE_CATALOG_API_TOKEN) {
      return res.status(500).json({ error: 'Template Catalog API Token not configured' });
    }

    const response = await axios.get(`${TEMPLATE_CATALOG_API_URL}/collections`, {
      headers: {
        'Authorization': `Bearer ${TEMPLATE_CATALOG_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Collections error:', error.message);
    res.status(500).json({ error: 'Failed to fetch collections' });
  }
});

app.get('/collections/:id', async (req, res) => {
  try {
    if (!TEMPLATE_CATALOG_API_TOKEN) {
      return res.status(500).json({ error: 'Template Catalog API Token not configured' });
    }

    const { id } = req.params;
    
    const response = await axios.get(`${TEMPLATE_CATALOG_API_URL}/collections/${id}`, {
      headers: {
        'Authorization': `Bearer ${TEMPLATE_CATALOG_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Collection fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch collection' });
  }
});

app.get('/designers', async (req, res) => {
  try {
    if (!TEMPLATE_CATALOG_API_TOKEN) {
      return res.status(500).json({ error: 'Template Catalog API Token not configured' });
    }

    const response = await axios.get(`${TEMPLATE_CATALOG_API_URL}/designers`, {
      headers: {
        'Authorization': `Bearer ${TEMPLATE_CATALOG_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Designers error:', error.message);
    res.status(500).json({ error: 'Failed to fetch designers' });
  }
});

app.get('/designers/:id', async (req, res) => {
  try {
    if (!TEMPLATE_CATALOG_API_TOKEN) {
      return res.status(500).json({ error: 'Template Catalog API Token not configured' });
    }

    const { id } = req.params;
    
    const response = await axios.get(`${TEMPLATE_CATALOG_API_URL}/designers/${id}`, {
      headers: {
        'Authorization': `Bearer ${TEMPLATE_CATALOG_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Designer fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch designer' });
  }
});

app.get('/tags', async (req, res) => {
  try {
    if (!TEMPLATE_CATALOG_API_TOKEN) {
      return res.status(500).json({ error: 'Template Catalog API Token not configured' });
    }

    const response = await axios.get(`${TEMPLATE_CATALOG_API_URL}/tags`, {
      headers: {
        'Authorization': `Bearer ${TEMPLATE_CATALOG_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Tags error:', error.message);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

// HTML Sanitization function
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

// HTML Importer API endpoint
app.post('/v1/html-importer', async (req, res) => {
  try {
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
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
