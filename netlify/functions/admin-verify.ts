import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import crypto from 'crypto';

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

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const authHeader = event.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { statusCode: 401, body: JSON.stringify({ error: "No token provided" }) };
    }
    
    const token = authHeader.substring(7);
    if (!validateToken(token)) {
      return { statusCode: 401, body: JSON.stringify({ error: "Invalid or expired token" }) };
    }
    
    return { statusCode: 200, body: JSON.stringify({ valid: true }) };
  } catch (error) {
    console.error('Error verifying token:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Verification failed' }) };
  }
};
