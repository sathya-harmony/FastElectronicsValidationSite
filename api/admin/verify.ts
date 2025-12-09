import type { VercelRequest, VercelResponse } from '@vercel/node';

const ADMIN_TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

function validateToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [timestampStr] = decoded.split(":");
    const timestamp = parseInt(timestampStr, 10);
    if (isNaN(timestamp)) return false;
    return Date.now() - timestamp < ADMIN_TOKEN_EXPIRY;
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
    
    return res.json({ valid: true });
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(500).json({ error: 'Verification failed' });
  }
}
