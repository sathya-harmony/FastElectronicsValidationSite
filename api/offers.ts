import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAllOffers, getOffersByProductId, getOffersByStoreId } from './_db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { productId, storeId } = req.query;
    
    if (productId) {
      const offers = await getOffersByProductId(parseInt(productId as string));
      return res.json(offers);
    }
    
    if (storeId) {
      const offers = await getOffersByStoreId(parseInt(storeId as string));
      return res.json(offers);
    }
    
    const offers = await getAllOffers();
    return res.json(offers);
  } catch (error) {
    console.error('Error fetching offers:', error);
    return res.status(500).json({ error: 'Failed to fetch offers' });
  }
}
