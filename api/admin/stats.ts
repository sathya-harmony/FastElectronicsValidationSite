import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getClickStats, getAllPilotSignups } from '../_db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const stats = await getClickStats();
    const signups = await getAllPilotSignups();
    
    return res.json({
      ...stats,
      signupCount: signups.length,
      recentSignups: signups.slice(0, 10)
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({ error: 'Failed to fetch stats' });
  }
}
