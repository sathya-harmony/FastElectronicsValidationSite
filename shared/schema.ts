import { sql } from "drizzle-orm";
import { pgTable, text, integer, serial, timestamp, numeric, jsonb, varchar, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const stores = pgTable("stores", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  neighborhood: text("neighborhood").notNull(),
  rating: numeric("rating", { precision: 3, scale: 2 }).notNull().default("4.5"),
  deliveryTimeRange: text("delivery_time_range").notNull(),
  priceLevel: text("price_level").notNull(),
  logo: text("logo").notNull(),
  description: text("description").notNull(),
  distanceKm: numeric("distance_km", { precision: 5, scale: 2 }).notNull().default("5"),
  lat: numeric("lat", { precision: 10, scale: 6 }).notNull().default("12.9716"), // Default to Bangalore center
  lng: numeric("lng", { precision: 10, scale: 6 }).notNull().default("77.5946"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertStoreSchema = createInsertSchema(stores).omit({
  id: true,
  createdAt: true,
});
export type InsertStore = z.infer<typeof insertStoreSchema>;
export type Store = typeof stores.$inferSelect;

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sku: text("sku").notNull().unique(),
  category: text("category").notNull(),
  shortDesc: text("short_desc").notNull(),
  image: text("image").notNull(),
  specs: jsonb("specs").notNull().$type<string[]>(),
  datasheetUrl: text("datasheet_url"),
  suitability: text("suitability"),
  longDescription: text("long_description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(), // e.g., 'pricing_mode'
  value: text("value").notNull(),     // e.g., 'flat_100'
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProductSchema = createInsertSchema(products);
export const insertOfferSchema = createInsertSchema(offers);
export const insertStoreSchema = createInsertSchema(stores);
export const insertPilotSignupSchema = createInsertSchema(pilotSignups);
export const insertSettingSchema = createInsertSchema(settings);

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
export type Offer = typeof offers.$inferSelect;
export type InsertOffer = typeof offers.$inferInsert;
export type Store = typeof stores.$inferSelect;
export type InsertStore = typeof stores.$inferInsert;
export type PilotSignup = typeof pilotSignups.$inferSelect;
export type InsertPilotSignup = typeof pilotSignups.$inferInsert;
export type Setting = typeof settings.$inferSelect;
export type InsertSetting = typeof settings.$inferInsert;

export const offers = pgTable("offers", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id),
  storeId: integer("store_id").notNull().references(() => stores.id),
  basePrice: integer("base_price").notNull(),
  price: integer("price").notNull(),
  displayedDeliveryFee: integer("displayed_delivery_fee").notNull().default(0),
  eta: integer("eta").notNull(),
  stock: integer("stock").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertOfferSchema = createInsertSchema(offers).omit({
  id: true,
  createdAt: true,
});
export type InsertOffer = z.infer<typeof insertOfferSchema>;
export type Offer = typeof offers.$inferSelect;

export const pilotSignups = pgTable("pilot_signups", {
  id: serial("id").primaryKey(),
  email: text("email"),
  phone: text("phone"),
  area: text("area"),
  notes: text("notes"),
  productInterest: text("product_interest"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPilotSignupSchema = createInsertSchema(pilotSignups).omit({
  id: true,
  createdAt: true,
});
export type InsertPilotSignup = z.infer<typeof insertPilotSignupSchema>;
export type PilotSignup = typeof pilotSignups.$inferSelect;

export const clickEvents = pgTable("click_events", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id),
  storeId: integer("store_id").references(() => stores.id),
  offerId: integer("offer_id").references(() => offers.id),
  eventType: text("event_type").notNull(),
  searchQuery: text("search_query"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertClickEventSchema = createInsertSchema(clickEvents).omit({
  id: true,
  createdAt: true,
});
export type InsertClickEvent = z.infer<typeof insertClickEventSchema>;
export type ClickEvent = typeof clickEvents.$inferSelect;

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  offerId: integer("offer_id").notNull().references(() => offers.id),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true,
});
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;
