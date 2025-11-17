import axios from 'axios';

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
    console.log('Plain text export requested');
    const payload = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    
    const response = await axios.post('https://api.getbee.io/v1/message/plain-text', payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': CS_AUTH
      }
    });

    console.log('Plain text export successful');
    res.status(200).send(response.data);
  } catch (error) {
    const details = error.response?.data || error.message || 'Unknown error';
    console.error('Plain text export error:', details);
    res.status(500).json({ message: 'Error exporting to plain text', details });
  }
}

