import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { getClickStats, getAllPilotSignups } from '../_db';

const ADMIN_TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

function validateToken(token: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const parts = decoded.split(":");
    if (parts.length !== 3) return false;
    const [timestampStr, randomBytes, signature] = parts;
    const timestamp = parseInt(timestampStr, 10);
    if (isNaN(timestamp)) return false;
    if (Date.now() - timestamp >= ADMIN_TOKEN_EXPIRY) return false;
    const payload = `${timestampStr}:${randomBytes}`;
    const expectedSignature = crypto.createHmac("sha256", adminPassword).update(payload).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  } catch {
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }
    const token = authHeader.substring(7);
    if (!validateToken(token)) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

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
