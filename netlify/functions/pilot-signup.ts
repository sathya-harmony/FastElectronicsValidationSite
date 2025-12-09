import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { createPilotSignup } from "../../api/_db";
import { insertPilotSignupSchema } from "../../shared/schema";

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const validation = insertPilotSignupSchema.safeParse(body);
    
    if (!validation.success) {
      return { statusCode: 400, body: JSON.stringify({ error: validation.error.message }) };
    }

    const signup = await createPilotSignup(validation.data);
    return { statusCode: 201, body: JSON.stringify(signup) };
  } catch (error) {
    console.error('Error creating pilot signup:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to create signup' }) };
  }
};
