import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { getClickStats, getAllPilotSignups } from "../../api/_db";

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const stats = await getClickStats();
    const signups = await getAllPilotSignups();
    
    return { 
      statusCode: 200, 
      body: JSON.stringify({
        ...stats,
        signupCount: signups.length,
        recentSignups: signups.slice(0, 10)
      })
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch stats' }) };
  }
};
