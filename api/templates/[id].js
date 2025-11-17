import axios from 'axios';

/**
 * Template Catalog - Get Single Template
 * 
 * GET /api/templates/{id}
 * 
 * Purpose: Fetch full template details including json_data
 * 
 * URL Parameters:
 *   - id: Template ID or slug
 * 
 * Response: Template object with full JSON data
 * 
 * Environment Variables Required:
 *   - TEMPLATE_CATALOG_API_TOKEN
 * 
 * External API: https://api.getbee.io/v1/catalog/templates/{id}
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const TEMPLATE_CATALOG_API_TOKEN = process.env.TEMPLATE_CATALOG_API_TOKEN;
    const TEMPLATE_CATALOG_API_URL = process.env.TEMPLATE_CATALOG_API_URL || 'https://api.getbee.io/v1/catalog';

    if (!TEMPLATE_CATALOG_API_TOKEN) {
      return res.status(500).json({ error: 'Template Catalog API Token not configured' });
    }

    // Vercel dynamic route: [id].js extracts ID from URL
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: 'Template ID is required' });
    }

    const apiUrl = `${TEMPLATE_CATALOG_API_URL}/templates/${id}`;
    console.log('Fetching template:', apiUrl);

    const response = await axios.get(apiUrl, {
      headers: {
        'Authorization': `Bearer ${TEMPLATE_CATALOG_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Template fetched successfully:', id);
    res.json(response.data);
  } catch (error) {
    console.error('Template fetch error:', {
      id: req.query.id,
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    res.status(error.response?.status || 500).json({ 
      error: error.response?.data?.message || error.message || 'Failed to fetch template' 
    });
  }
}

