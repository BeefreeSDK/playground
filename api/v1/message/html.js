import axios from 'axios';

/**
 * Content Services - HTML Export
 * 
 * POST /v1/message/html
 * 
 * Purpose: Convert Beefree template JSON to HTML email
 * 
 * Request Body: Template JSON (the entire template object)
 * 
 * Response: HTML string (may be wrapped in JSON with body.html)
 * 
 * Environment Variables Required:
 *   - CS_API_TOKEN (Content Services API token)
 * 
 * External API: https://api.getbee.io/v1/message/html
 * 
 * Note: Response handling on frontend checks for both:
 * - Plain HTML string
 * - JSON-wrapped HTML in body.html property
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Ensure Bearer prefix on token
  const CS_API_TOKEN = process.env.CS_API_TOKEN;
  const CS_AUTH = CS_API_TOKEN?.startsWith('Bearer ') ? CS_API_TOKEN : (CS_API_TOKEN ? `Bearer ${CS_API_TOKEN}` : '');

  if (!CS_AUTH) {
    console.error('CS_API_TOKEN not configured');
    return res.status(500).json({ error: 'CS_API_TOKEN is not configured' });
  }

  try {
    console.log('HTML export requested');
    const payload = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    
    const response = await axios.post('https://api.getbee.io/v1/message/html', payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': CS_AUTH
      }
    });

    console.log('HTML export successful');
    res.status(200).send(response.data);
  } catch (error) {
    const details = error.response?.data || error.message || 'Unknown error';
    console.error('HTML export error:', details);
    res.status(500).json({ message: 'Error exporting to HTML', details });
  }
}

