import type { VercelRequest, VercelResponse } from '@vercel/node';
import { trackClickEvent } from './_db';
import { insertClickEventSchema } from '../shared/schema';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const validation = insertClickEventSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.message });
    }

    const event = await trackClickEvent(validation.data);
    return res.status(201).json(event);
  } catch (error) {
    console.error('Error tracking event:', error);
    return res.status(500).json({ error: 'Failed to track event' });
  }
}
