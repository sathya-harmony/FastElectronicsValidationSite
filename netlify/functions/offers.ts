import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { getAllOffers, getOffersByProductId, getOffersByStoreId } from "../../api/_db";

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const params = event.queryStringParameters || {};
    
    // Handle productId query parameter
    if (params.productId) {
      const offers = await getOffersByProductId(parseInt(params.productId));
      return { 
        statusCode: 200, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offers) 
      };
    }
    
    // Handle storeId query parameter
    if (params.storeId) {
      const offers = await getOffersByStoreId(parseInt(params.storeId));
      return { 
        statusCode: 200, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offers) 
      };
    }
    
    // Return all offers
    const offers = await getAllOffers();
    return { 
      statusCode: 200, 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(offers) 
    };
  } catch (error) {
    console.error('Error fetching offers:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch offers' }) };
  }
};
