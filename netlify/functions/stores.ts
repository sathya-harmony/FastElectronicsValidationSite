import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { getAllStores, getStoreById } from "../../api/_db";

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const params = event.queryStringParameters || {};
    const path = event.path
      .replace('/.netlify/functions/stores', '')
      .replace('/api/stores', '');
    
    // Handle store ID from path
    const pathId = path.replace('/', '').trim();
    if (pathId && !isNaN(parseInt(pathId))) {
      const store = await getStoreById(parseInt(pathId));
      if (!store) {
        return { statusCode: 404, body: JSON.stringify({ error: 'Store not found' }) };
      }
      return { 
        statusCode: 200, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(store) 
      };
    }
    
    // Handle ID in query params
    if (params.id) {
      const store = await getStoreById(parseInt(params.id));
      if (!store) {
        return { statusCode: 404, body: JSON.stringify({ error: 'Store not found' }) };
      }
      return { 
        statusCode: 200, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(store) 
      };
    }
    
    // Return all stores
    const stores = await getAllStores();
    return { 
      statusCode: 200, 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stores) 
    };
  } catch (error) {
    console.error('Error fetching stores:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch stores' }) };
  }
};
