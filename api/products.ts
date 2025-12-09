import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAllProducts, getProductById, searchProducts } from './_db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id, q } = req.query;
    
    if (id) {
      const product = await getProductById(parseInt(id as string));
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      return res.json(product);
    }
    
    if (q !== undefined) {
      const results = await searchProducts(q as string);
      return res.json(results);
    }
    
    const products = await getAllProducts();
    return res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ error: 'Failed to fetch products' });
  }
}
