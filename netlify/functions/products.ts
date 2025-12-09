import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { getAllProducts, getProductById, searchProducts } from "../../api/_db";

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const params = event.queryStringParameters || {};
    const path = event.path
      .replace('/.netlify/functions/products', '')
      .replace('/api/products', '');
    
    // Handle search query parameter
    if (params.q !== undefined) {
      const results = await searchProducts(params.q);
      return { 
        statusCode: 200, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(results) 
      };
    }
    
    // Handle /search path
    if (path.startsWith('/search')) {
      const results = await searchProducts('');
      return { 
        statusCode: 200, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(results) 
      };
    }
    
    // Handle product ID path
    const id = path.replace('/', '').trim();
    if (id && !isNaN(parseInt(id))) {
      const product = await getProductById(parseInt(id));
      if (!product) {
        return { statusCode: 404, body: JSON.stringify({ error: 'Product not found' }) };
      }
      return { 
        statusCode: 200, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product) 
      };
    }
    
    // Handle ID in query params
    if (params.id) {
      const product = await getProductById(parseInt(params.id));
      if (!product) {
        return { statusCode: 404, body: JSON.stringify({ error: 'Product not found' }) };
      }
      return { 
        statusCode: 200, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product) 
      };
    }
    
    // Return all products
    const products = await getAllProducts();
    return { 
      statusCode: 200, 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(products) 
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch products' }) };
  }
};
