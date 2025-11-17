import axios from 'axios';

/**
 * Content Services - PDF Export
 * 
 * POST /v1/message/pdf
 * 
 * Purpose: Convert HTML email to PDF
 * 
 * IMPORTANT: This endpoint requires HTML, NOT template JSON!
 * Frontend auto-generates HTML first if not already done.
 * 
 * Request Body:
 *   {
 *     "html": "<html>...</html>",
 *     "page_size": "Full",           // or "A4", "Letter", etc.
 *     "page_orientation": "landscape" // or "portrait"
 *   }
 * 
 * Response:
 *   { body: { url: "https://..." } }  // PDF download URL
 * 
 * Environment Variables Required:
 *   - CS_API_TOKEN (Content Services API token)
 * 
 * External API: https://api.getbee.io/v1/message/pdf
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const CS_API_TOKEN = process.env.CS_API_TOKEN;
  const CS_AUTH = CS_API_TOKEN?.startsWith('Bearer ') ? CS_API_TOKEN : (CS_API_TOKEN ? `Bearer ${CS_API_TOKEN}` : '');

  if (!CS_AUTH) {
    console.error('CS_API_TOKEN not configured');
    return res.status(500).json({ error: 'CS_API_TOKEN is not configured' });
  }

  try {
    console.log('PDF export requested');
    const payload = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    
    const response = await axios.post('https://api.getbee.io/v1/message/pdf', payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': CS_AUTH
      }
    });

    console.log('PDF export successful');
    res.status(200).send(response.data);
  } catch (error) {
    const details = error.response?.data || error.message || 'Unknown error';
    console.error('PDF export error:', details);
    res.status(500).json({ message: 'Error exporting to PDF', details });
  }
}

