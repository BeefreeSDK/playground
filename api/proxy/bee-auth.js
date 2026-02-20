import axios from 'axios';

/**
 * Beefree SDK Authentication Endpoint
 *
 * POST /proxy/bee-auth
 *
 * Environment Variables Required:
 *   - BEE_CLIENT_ID
 *   - BEE_CLIENT_SECRET
 *
 * External API: https://auth.getbee.io/loginV2
 */

const VALID_UID_PATTERN = /^[a-zA-Z0-9_-]+$/;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { uid } = req.body;

  // Validate uid: must be a string, alphanumeric + dashes, max 128 chars
  const sanitizedUid = (typeof uid === 'string' && VALID_UID_PATTERN.test(uid) && uid.length <= 128)
    ? uid
    : 'demo-user';

  try {
    const response = await axios.post(
      'https://auth.getbee.io/loginV2',
      {
        client_id: process.env.BEE_CLIENT_ID,
        client_secret: process.env.BEE_CLIENT_SECRET,
        uid: sanitizedUid
      },
      { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
    );

    res.json(response.data);
  } catch (error) {
    const status = error.response?.status;
    const responseData = error.response?.data;
    console.error('Auth error:', {
      message: error.message,
      status,
      responseData,
      uid: sanitizedUid,
    });
    res.status(500).json({ error: 'Failed to authenticate' });
  }
}
