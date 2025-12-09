import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

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
