import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

function generateToken(secret: string): string {
  const timestamp = Date.now().toString();
  const randomBytes = crypto.randomBytes(32).toString("hex");
  const payload = `${timestamp}:${randomBytes}`;
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return Buffer.from(`${payload}:${signature}`).toString("base64");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminPassword) {
      console.error("ADMIN_PASSWORD not configured");
      return res.status(500).json({ error: "Admin authentication not configured" });
    }
    
    if (password !== adminPassword) {
      return res.status(401).json({ error: "Invalid password" });
    }
    
    const token = generateToken(adminPassword);
    return res.json({ token });
  } catch (error) {
    console.error('Error in admin login:', error);
    return res.status(500).json({ error: 'Login failed' });
  }
}
