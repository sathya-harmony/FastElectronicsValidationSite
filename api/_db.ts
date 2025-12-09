import { drizzle } from "drizzle-orm/node-postgres";
import { eq, ilike, sql, and, desc, or } from "drizzle-orm";
import pg from "pg";
import { 
  stores,
  products,
  offers,
  pilotSignups,
  clickEvents,
  type InsertPilotSignup,
  type InsertClickEvent
} from "../shared/schema";

const { Pool } = pg;

let pool: pg.Pool | null = null;

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
  }
  return pool;
}

export function getDb() {
  return drizzle(getPool());
}

export async function getAllStores() {
  const db = getDb();
  return await db.select().from(stores);
}

export async function getStoreById(id: number) {
  const db = getDb();
  const result = await db.select().from(stores).where(eq(stores.id, id));
  return result[0];
}

export async function getAllProducts() {
  const db = getDb();
  return await db.select().from(products);
}

export async function getProductById(id: number) {
  const db = getDb();
  const result = await db.select().from(products).where(eq(products.id, id));
  return result[0];
}

export async function searchProducts(query: string) {
  const db = getDb();
  if (!query.trim()) {
    return await db.select().from(products);
  }
  
  const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 0);
  
  if (terms.length === 0) {
    return await db.select().from(products);
  }
  
  const termConditions = terms.map(term => 
    or(
      sql`LOWER(${products.name}) LIKE ${`%${term}%`}`,
      sql`LOWER(${products.category}) LIKE ${`%${term}%`}`,
      sql`LOWER(${products.sku}) LIKE ${`%${term}%`}`,
      sql`LOWER(${products.shortDesc}) LIKE ${`%${term}%`}`
    )
  );
  
  return await db.select().from(products).where(
    and(...termConditions)
  );
}

export async function getAllOffers() {
  const db = getDb();
  return await db.select().from(offers);
}

export async function getOffersByProductId(productId: number) {
  const db = getDb();
  return await db.select().from(offers).where(eq(offers.productId, productId));
}

export async function getOffersByStoreId(storeId: number) {
  const db = getDb();
  return await db.select().from(offers).where(eq(offers.storeId, storeId));
}

export async function createPilotSignup(signup: InsertPilotSignup) {
  const db = getDb();
  const result = await db.insert(pilotSignups).values(signup).returning();
  return result[0];
}

export async function getAllPilotSignups() {
  const db = getDb();
  return await db.select().from(pilotSignups).orderBy(desc(pilotSignups.createdAt));
}

export async function trackClickEvent(event: InsertClickEvent) {
  const db = getDb();
  const result = await db.insert(clickEvents).values(event).returning();
  return result[0];
}

export async function getClickStats() {
  const db = getDb();
  const totalClicksResult = await db.select({ count: sql<number>`count(*)` }).from(clickEvents);
  const totalClicks = Number(totalClicksResult[0]?.count || 0);

  const topSearchesResult = await db
    .select({ 
      query: clickEvents.searchQuery, 
      count: sql<number>`count(*)` 
    })
    .from(clickEvents)
    .where(and(eq(clickEvents.eventType, 'search'), sql`${clickEvents.searchQuery} IS NOT NULL`))
    .groupBy(clickEvents.searchQuery)
    .orderBy(desc(sql`count(*)`))
    .limit(5);

  const topSearches = topSearchesResult.map(r => ({
    query: r.query || '',
    count: Number(r.count)
  }));

  return { totalClicks, topSearches };
}
