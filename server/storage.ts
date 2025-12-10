import {
  type User,
  type InsertUser,
  type Store,
  type InsertStore,
  type Product,
  type InsertProduct,
  type Offer,
  type InsertOffer,
  type PilotSignup,
  type InsertPilotSignup,
  type ClickEvent,
  type InsertClickEvent,
  stores,
  products,
  offers,
  pilotSignups,
  clickEvents,
  cartItems,
  settings
} from "../shared/schema.js";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq, ilike, sql, and, desc, or } from "drizzle-orm";
import pg from "pg";

const { Pool } = pg;

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getAllStores(): Promise<Store[]>;
  getStoreById(id: number): Promise<Store | undefined>;
  createStore(store: InsertStore): Promise<Store>;

  getAllProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductBySku(sku: string): Promise<Product | undefined>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  deleteAllProducts(): Promise<void>;

  getAllOffers(): Promise<Offer[]>;
  getOffersByProductId(productId: number): Promise<Offer[]>;
  getOffersByStoreId(storeId: number): Promise<Offer[]>;
  createOffer(offer: InsertOffer): Promise<Offer>;
  deleteAllOffers(): Promise<void>;
  deleteAllStores(): Promise<void>;

  createPilotSignup(signup: InsertPilotSignup): Promise<PilotSignup>;
  getAllPilotSignups(): Promise<PilotSignup[]>;

  trackClickEvent(event: InsertClickEvent): Promise<ClickEvent>;
  trackEventBatch(events: InsertClickEvent[]): Promise<void>;
  getClickStats(): Promise<{
    totalClicks: number,
    uniqueVisitors: number,
    checkoutClicks: number,
    topSearches: { query: string, count: number }[],
    paymentMethods: { method: string, count: number }[]
  }>;

  resetAnalytics(): Promise<void>;
  deleteAllClickEvents(): Promise<void>;
  deleteAllCartItems(): Promise<void>;

  getSetting(key: string): Promise<string | undefined>;
  updateSetting(key: string, value: string): Promise<string>;
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export const db = drizzle(pool);

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    return undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    throw new Error("Not implemented");
  }

  async getAllStores(): Promise<Store[]> {
    return await db.select().from(stores);
  }

  async getStoreById(id: number): Promise<Store | undefined> {
    const result = await db.select().from(stores).where(eq(stores.id, id));
    return result[0];
  }

  async createStore(store: InsertStore): Promise<Store> {
    const result = await db.insert(stores).values(store).returning();
    if (!result[0]) throw new Error("Failed to create store");
    return result[0];
  }

  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id));
    return result[0];
  }

  async getProductBySku(sku: string): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.sku, sku));
    return result[0];
  }

  async searchProducts(query: string): Promise<Product[]> {
    if (!query.trim()) {
      return await db.select().from(products);
    }

    const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 0);

    if (terms.length === 0) {
      return await db.select().from(products);
    }

    // For each term, check if it matches any field (OR across fields)
    // Then AND all terms together (product must match ALL terms)
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

  async createProduct(product: InsertProduct): Promise<Product> {
    const result = await db.insert(products).values(product as any).returning();
    if (!result[0]) throw new Error("Failed to create product");
    return result[0];
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product> {
    const result = await db.update(products).set(product as any).where(eq(products.id, id)).returning();
    if (!result[0]) throw new Error("Failed to update product");
    return result[0];
  }

  async deleteAllProducts(): Promise<void> {
    await db.delete(products);
  }

  async getAllOffers(): Promise<Offer[]> {
    return await db.select().from(offers);
  }

  async getOffersByProductId(productId: number): Promise<Offer[]> {
    return await db.select().from(offers).where(eq(offers.productId, productId));
  }

  async getOffersByStoreId(storeId: number): Promise<Offer[]> {
    return await db.select().from(offers).where(eq(offers.storeId, storeId));
  }

  async createOffer(offer: InsertOffer): Promise<Offer> {
    const result = await db.insert(offers).values(offer).returning();
    if (!result[0]) throw new Error("Failed to create offer");
    return result[0];
  }

  async deleteAllOffers(): Promise<void> {
    await db.delete(offers);
  }

  async deleteAllStores(): Promise<void> {
    await db.delete(stores);
  }

  async createPilotSignup(signup: InsertPilotSignup): Promise<PilotSignup> {
    const result = await db.insert(pilotSignups).values(signup).returning();
    if (!result[0]) throw new Error("Failed to create signup");
    return result[0];
  }

  async getAllPilotSignups(): Promise<PilotSignup[]> {
    return await db.select().from(pilotSignups).orderBy(desc(pilotSignups.createdAt));
  }

  async trackClickEvent(event: InsertClickEvent): Promise<ClickEvent> {
    const [click] = await db.insert(clickEvents).values(event).returning();
    return click;
  }

  async trackEventBatch(events: InsertClickEvent[]): Promise<void> {
    if (events.length === 0) return;
    await db.insert(clickEvents).values(events);
  }

  async getClickStats(): Promise<{
    totalClicks: number,
    uniqueVisitors: number,
    checkoutClicks: number,
    topSearches: { query: string, count: number }[],
    paymentMethods: { method: string, count: number }[]
  }> {
    const totalClicksResult = await db.select({ count: sql<number>`count(*)` }).from(clickEvents);
    const totalClicks = Number(totalClicksResult[0]?.count || 0);

    const uniqueVisitorsResult = await db
      .select({ count: sql<number>`count(distinct ${clickEvents.sessionId})` })
      .from(clickEvents)
      .where(sql`${clickEvents.sessionId} IS NOT NULL`);
    const uniqueVisitors = Number(uniqueVisitorsResult[0]?.count || 0);

    const checkoutClicksResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(clickEvents)
      .where(eq(clickEvents.eventType, 'checkout'));
    const checkoutClicks = Number(checkoutClicksResult[0]?.count || 0);

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

    const paymentMethodsResult = await db
      .select({
        method: clickEvents.searchQuery,
        count: sql<number>`count(*)`
      })
      .from(clickEvents)
      .where(eq(clickEvents.eventType, 'payment_option_selected'))
      .groupBy(clickEvents.searchQuery)
      .orderBy(desc(sql`count(*)`));

    const paymentMethods = paymentMethodsResult.map(r => ({
      method: r.method || 'Unknown',
      count: Number(r.count)
    }));

    return { totalClicks, uniqueVisitors, checkoutClicks, topSearches, paymentMethods };
  }

  async resetAnalytics(): Promise<void> {
    await db.delete(clickEvents);
    await db.delete(pilotSignups);
  }

  async deleteAllClickEvents(): Promise<void> {
    await db.delete(clickEvents);
  }

  async deleteAllCartItems(): Promise<void> {
    await db.delete(cartItems);
  }

  async getSetting(key: string): Promise<string | undefined> {
    const result = await db.select().from(settings).where(eq(settings.key, key));
    return result[0]?.value;
  }

  async updateSetting(key: string, value: string): Promise<string> {
    const existing = await this.getSetting(key);
    if (existing) {
      await db.update(settings)
        .set({ value, updatedAt: new Date() })
        .where(eq(settings.key, key));
    } else {
      await db.insert(settings).values({ key, value });
    }
    return value;
  }
}

export const storage = new DbStorage();
