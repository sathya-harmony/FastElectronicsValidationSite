import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createPilotSignup } from './_db';
import { insertPilotSignupSchema } from '../shared/schema';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const validation = insertPilotSignupSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.message });
    }

    const signup = await createPilotSignup(validation.data);
    return res.status(201).json(signup);
  } catch (error) {
    console.error('Error creating pilot signup:', error);
    return res.status(500).json({ error: 'Failed to create signup' });
  }
}
