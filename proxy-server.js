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
const CS_API_TOKEN = process.env.CS_API_TOKEN;
const RAW_CS_TOKEN = CS_API_TOKEN || '';
const CS_AUTH = RAW_CS_TOKEN.startsWith('Bearer ') ? RAW_CS_TOKEN : (RAW_CS_TOKEN ? `Bearer ${RAW_CS_TOKEN}` : '');
const HTML_IMPORTER_API_KEY = process.env.HTML_IMPORTER_API_KEY;
const HTML_IMPORTER_URL = process.env.HTML_IMPORTER_URL || 'https://api.getbee.io/v1/conversion/html-to-json';

// Cache for performance optimization
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCacheKey(url, body) {
  return `${url}:${JSON.stringify(body)}`;
}

function getFromCache(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

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
app.get('/templates', async (req, res) => {
  try {
    if (!TEMPLATE_CATALOG_API_TOKEN) {
      return res.status(500).json({ error: 'Template Catalog API Token not configured' });
    }

    const { category, collection, designer, tag, limit = 20, offset = 0 } = req.query;
    
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (collection) params.append('collection', collection);
    if (designer) params.append('designer', designer);
    if (tag) params.append('tag', tag);
    if (limit) params.append('limit', limit);
    if (offset) params.append('offset', offset);
    
    const response = await axios.get(`${TEMPLATE_CATALOG_API_URL}/templates?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${TEMPLATE_CATALOG_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Template catalog error:', error.message);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

app.get('/templates/:id', async (req, res) => {
  try {
    if (!TEMPLATE_CATALOG_API_TOKEN) {
      return res.status(500).json({ error: 'Template Catalog API Token not configured' });
    }

    const { id } = req.params;
    
    const response = await axios.get(`${TEMPLATE_CATALOG_API_URL}/templates/${id}`, {
      headers: {
        'Authorization': `Bearer ${TEMPLATE_CATALOG_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Template fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch template' });
  }
});

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

// Helper to forward POST requests to Content Services API (v1)
const forwardPost = async (targetUrl, req, res, responseType = 'json') => {
  if (!CS_AUTH) {
    res.status(500).json({ error: 'CS_API_TOKEN is not configured' });
    return;
  }
  try {
    const payload = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    const response = await axios.post(targetUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': CS_AUTH
      },
      responseType
    });

    if (responseType === 'arraybuffer') {
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', 'inline');
      res.status(200).send(response.data);
      return;
    }
    res.status(200).send(response.data);
  } catch (error) {
    const details = (error && error.response && error.response.data) || error.message || 'Unknown error';
    console.error('CS API forward error:', details);
    res.status(500).json({ message: `Error exporting from ${targetUrl}`, details });
  }
};

// Content Services API Export Endpoints
app.post('/v1/message/html', async (req, res) => {
  await forwardPost('https://api.getbee.io/v1/message/html', req, res);
});

app.post('/v1/message/plain-text', async (req, res) => {
  await forwardPost('https://api.getbee.io/v1/message/plain-text', req, res);
});

app.post('/v1/message/pdf', async (req, res) => {
  await forwardPost('https://api.getbee.io/v1/message/pdf', req, res);
});

// Image (returns binary)
app.post('/v1/message/image', async (req, res) => {
  await forwardPost('https://api.getbee.io/v1/message/image', req, res, 'arraybuffer');
});

// Cache management endpoints
app.get('/cache/status', (req, res) => {
  res.json({
    size: cache.size,
    keys: Array.from(cache.keys()).slice(0, 10) // Show first 10 keys
  });
});

app.post('/cache/clear', (req, res) => {
  cache.clear();
  res.json({ message: 'Cache cleared' });
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

// Auto-cleanup expired cache entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      cache.delete(key);
    }
  }
}, 10 * 60 * 1000);

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
