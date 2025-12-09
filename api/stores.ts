import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAllStores, getStoreById } from './_db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    
    if (id) {
      const store = await getStoreById(parseInt(id as string));
      if (!store) {
        return res.status(404).json({ error: 'Store not found' });
      }
      return res.json(store);
    }
    
    const stores = await getAllStores();
    return res.json(stores);
  } catch (error) {
    console.error('Error fetching stores:', error);
    return res.status(500).json({ error: 'Failed to fetch stores' });
  }
}
