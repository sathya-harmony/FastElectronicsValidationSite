import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import crypto from 'crypto';

function generateToken(): string {
  const timestamp = Date.now().toString();
  const randomBytes = crypto.randomBytes(32).toString("hex");
  return Buffer.from(`${timestamp}:${randomBytes}`).toString("base64");
}

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { password } = body;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminPassword) {
      console.error("ADMIN_PASSWORD not configured");
      return { statusCode: 500, body: JSON.stringify({ error: "Admin authentication not configured" }) };
    }
    
    if (password !== adminPassword) {
      return { statusCode: 401, body: JSON.stringify({ error: "Invalid password" }) };
    }
    
    const token = generateToken();
    return { statusCode: 200, body: JSON.stringify({ token }) };
  } catch (error) {
    console.error('Error in admin login:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Login failed' }) };
  }
};
