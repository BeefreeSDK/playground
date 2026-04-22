import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
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
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 requests per windowMs
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
  res.sendFile(path.join(__dirname, 'public/custom-rows.json'));
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
        uid: sanitizedUid,
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

// Load sample HTML at startup
const SAMPLE_HTML = readFileSync(path.join(__dirname, 'public/sample-newsletter.html'), 'utf-8');

// HTML Importer API endpoint — converts the pre-defined sample HTML to Beefree JSON
app.get('/v1/html-importer', async (req, res) => {
  try {
    if (!HTML_IMPORTER_API_KEY) {
      return res.status(500).json({ error: 'HTML Importer API Key not configured' });
    }

    // Call Beefree HTML Importer API with the pre-defined sample HTML
    const response = await axios.post(
      HTML_IMPORTER_URL,
      SAMPLE_HTML,
      {
        headers: {
          'Authorization': `Bearer ${HTML_IMPORTER_API_KEY}`,
          'Content-Type': 'text/html'
        },
        timeout: 15000,
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

    if (error.code === 'ECONNABORTED') {
      res.status(408).json({ error: 'Request timeout - HTML processing took too long' });
    } else {
      res.status(status || 500).json({ error: 'Failed to import HTML', ...(upstream && { details: upstream }) });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Playground proxy server running on http://localhost:${PORT}`);
  console.log('Environment:', {
    PORT,
    ALLOWED_ORIGINS,
    BEE_CLIENT_ID: BEE_CLIENT_ID || '(not set)',
    BEE_CLIENT_SECRET: BEE_CLIENT_SECRET || '(not set)',
    HTML_IMPORTER_API_KEY: HTML_IMPORTER_API_KEY || '(not set)',
  });
});
