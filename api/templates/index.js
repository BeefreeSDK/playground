import axios from 'axios';

/**
 * Template Catalog - Get Templates List
 * 
 * GET /api/templates?limit=10&offset=0&category=...&collection=...
 * 
 * Purpose: Fetch templates from Beefree Template Catalog API
 * 
 * Query Parameters:
 *   - limit: Number of templates to return (default: 20)
 *   - offset: Pagination offset (default: 0)
 *   - category: Filter by category ID
 *   - collection: Filter by collection ID
 *   - designer: Filter by designer ID
 *   - tag: Filter by tag
 * 
 * Response: Array of templates with metadata
 * 
 * Environment Variables Required:
 *   - TEMPLATE_CATALOG_API_TOKEN
 * 
 * External API: https://api.getbee.io/v1/catalog/templates
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

    // Extract query parameters for filtering and pagination
    const { category, collection, designer, tag, limit = 20, offset = 0 } = req.query;
    
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (collection) params.append('collection', collection);
    if (designer) params.append('designer', designer);
    if (tag) params.append('tag', tag);
    params.append('limit', String(limit));
    params.append('offset', String(offset));
    
    const queryString = params.toString();
    const apiUrl = `${TEMPLATE_CATALOG_API_URL}/templates?${queryString}`;

    console.log('Fetching templates from:', apiUrl);

    const response = await axios.get(apiUrl, {
      headers: {
        'Authorization': `Bearer ${TEMPLATE_CATALOG_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Templates fetched successfully:', response.data?.length || 'unknown count');
    res.json(response.data);
  } catch (error) {
    console.error('Templates API error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    res.status(error.response?.status || 500).json({ 
      error: error.response?.data?.message || error.message || 'Failed to fetch templates' 
    });
  }
}

