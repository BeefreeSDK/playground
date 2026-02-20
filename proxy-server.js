import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Constants
const MAX_PAYLOAD_SIZE = '5mb';
const MAX_HTML_SIZE = 500000; // 500KB
const VALID_ID_PATTERN = /^[a-zA-Z0-9_-]+$/;

// Allowed origins for CORS
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173'];

// Security headers
app.use(helmet());

// CORS — restrict to known origins
app.use(cors({
  origin: ALLOWED_ORIGINS,
  methods: ['GET', 'POST'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Stricter rate limit for auth endpoint
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

// Body parsers with reduced payload limit
app.use(express.json({ limit: MAX_PAYLOAD_SIZE }));
app.use(express.urlencoded({ limit: MAX_PAYLOAD_SIZE, extended: true }));
app.use(express.text({ type: ['text/*', 'application/xhtml+xml', 'application/xml'], limit: MAX_PAYLOAD_SIZE }));

const BEE_CLIENT_ID = process.env.BEE_CLIENT_ID;
const BEE_CLIENT_SECRET = process.env.BEE_CLIENT_SECRET;
const HTML_IMPORTER_API_KEY = process.env.HTML_IMPORTER_API_KEY;
const HTML_IMPORTER_URL = 'https://api.getbee.io/v1/conversion/html-to-json';

// Custom rows endpoint — serves static JSON for Beefree SDK external content rows.
// Uses permissive CORS so the SDK iframe (on a different origin) can fetch it.
app.get('/api/customrows', (_req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.sendFile(path.join(__dirname, 'public/assets/custom-rows.json'));
});

// Healthcheck
app.get('/healthcheck', (_req, res) => {
  res.json({ status: 'ok' });
});

// V2 Auth Endpoint
app.post('/proxy/bee-auth', authLimiter, async (req, res) => {
  try {
    const { uid } = req.body;

    // Validate uid: must be a string, alphanumeric + dashes, max 128 chars
    const sanitizedUid = (typeof uid === 'string' && VALID_ID_PATTERN.test(uid) && uid.length <= 128)
      ? uid
      : 'demo-user';

    const response = await axios.post(
      'https://auth.getbee.io/loginV2',
      {
        client_id: BEE_CLIENT_ID,
        client_secret: BEE_CLIENT_SECRET,
        uid: sanitizedUid
      },
      { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
    );

    res.json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const upstream = error.response?.data;
    console.error('Auth error:', {
      status,
      message: error.message,
      upstream,
    });
    res.status(status).json({
      error: 'Failed to authenticate',
      ...(upstream && { details: upstream }),
    });
  }
});

/**
 * HTML Sanitization function.
 * Removes dangerous elements, protocols, and event handlers.
 */
const sanitizeHtml = (html) => {
  if (typeof html !== 'string') {
    return { content: '', wasModified: false };
  }

  const originalLength = html.length;
  let sanitized = html;

  // Remove script tags (including variations)
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove iframe tags
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');

  // Remove object/embed/applet tags
  sanitized = sanitized.replace(/<(object|embed|applet)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>/gi, '');

  // Remove dangerous URL protocols (javascript:, vbscript:, data: except images)
  // Handle URL-encoded and case variations
  sanitized = sanitized.replace(/(?:java|vb)\s*script\s*:/gi, '');
  sanitized = sanitized.replace(/&#\d+;?/gi, (match) => {
    const decoded = String.fromCharCode(parseInt(match.replace(/&#|;/g, '')));
    return decoded;
  });
  // Re-run after entity decoding
  sanitized = sanitized.replace(/(?:java|vb)\s*script\s*:/gi, '');

  // Remove data: URLs that could be harmful (keep image data URLs)
  sanitized = sanitized.replace(/data:(?!image\/)[^\s"']+/gi, '');

  // Remove all on* event handlers (comprehensive regex)
  sanitized = sanitized.replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '');

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

    // Sanitize HTML
    const sanitizationResult = sanitizeHtml(html);
    const sanitizedHtml = sanitizationResult.content;

    if (sanitizedHtml.length > MAX_HTML_SIZE) {
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
        timeout: 15000,
        maxContentLength: MAX_HTML_SIZE,
        maxBodyLength: MAX_HTML_SIZE
      }
    );

    res.json(response.data);
  } catch (error) {
    const status = error.response?.status;
    const upstream = error.response?.data;
    console.error('HTML Importer error:', {
      status: status || 'N/A',
      message: error.message,
      code: error.code,
      upstream,
    });

    if (status === 413) {
      res.status(413).json({ error: 'HTML content too large', ...(upstream && { details: upstream }) });
    } else if (status === 422) {
      res.status(422).json({ error: 'Invalid HTML format. Please check the HTML content.', ...(upstream && { details: upstream }) });
    } else if (error.code === 'ECONNABORTED') {
      res.status(408).json({ error: 'Request timeout - HTML processing took too long' });
    } else {
      res.status(status || 500).json({ error: 'Failed to import HTML', ...(upstream && { details: upstream }) });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
