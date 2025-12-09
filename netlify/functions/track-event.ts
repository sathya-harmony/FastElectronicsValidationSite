import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { trackClickEvent } from "../../api/_db";
import { insertClickEventSchema } from "../../shared/schema";

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const validation = insertClickEventSchema.safeParse(body);
    
    if (!validation.success) {
      return { statusCode: 400, body: JSON.stringify({ error: validation.error.message }) };
    }

    const event_data = await trackClickEvent(validation.data);
    return { statusCode: 201, body: JSON.stringify(event_data) };
  } catch (error) {
    console.error('Error tracking event:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to track event' }) };
  }
};
