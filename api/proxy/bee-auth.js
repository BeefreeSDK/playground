import axios from 'axios';

/**
 * Beefree SDK Authentication Endpoint
 * 
 * POST /proxy/bee-auth
 * 
 * Purpose: Authenticate with Beefree and get access token for SDK initialization
 * 
 * Request Body:
 *   { uid: 'demo-user' }  // User identifier
 * 
 * Response:
 *   { token, access_token, ... }  // Authentication data for SDK
 * 
 * Environment Variables Required:
 *   - BEE_CLIENT_ID
 *   - BEE_CLIENT_SECRET
 * 
 * External API: https://auth.getbee.io/loginV2
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { uid } = req.body;
    
    // Call Beefree authentication API
    const response = await axios.post(
      'https://auth.getbee.io/loginV2',
      {
        client_id: process.env.BEE_CLIENT_ID,
        client_secret: process.env.BEE_CLIENT_SECRET,
        uid: uid || 'demo-user'
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(500).json({ error: 'Failed to authenticate' });
  }
}

