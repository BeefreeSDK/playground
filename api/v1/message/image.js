import axios from 'axios';

/**
 * Content Services - Image Export (Thumbnail)
 * 
 * POST /v1/message/image
 * 
 * Purpose: Convert HTML email to PNG thumbnail image
 * 
 * IMPORTANT: This endpoint requires HTML, NOT template JSON!
 * Frontend auto-generates HTML first if not already done.
 * 
 * Request Body:
 *   {
 *     "html": "<html>...</html>",
 *     "file_type": "png",      // or "jpg"
 *     "size": "1000"           // Width in pixels
 *   }
 * 
 * Response: Binary PNG data (arraybuffer)
 * Frontend converts to Blob and creates object URL for display
 * 
 * Environment Variables Required:
 *   - CS_API_TOKEN (Content Services API token)
 * 
 * External API: https://api.getbee.io/v1/message/image
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
    console.log('Image export requested');
    const payload = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    
    const response = await axios.post('https://api.getbee.io/v1/message/image', payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': CS_AUTH
      },
      responseType: 'arraybuffer'
    });

    console.log('Image export successful');
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'inline');
    res.status(200).send(response.data);
  } catch (error) {
    const details = error.response?.data || error.message || 'Unknown error';
    console.error('Image export error:', details);
    res.status(500).json({ message: 'Error exporting to image', details });
  }
}

