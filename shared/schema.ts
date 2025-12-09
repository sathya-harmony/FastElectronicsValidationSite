import { sql } from "drizzle-orm";
import { pgTable, text, integer, serial, timestamp, numeric, jsonb, varchar } from "drizzle-orm/pg-core";
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
  category: text("category").notNull(),
  shortDesc: text("short_desc").notNull(),
  image: text("image").notNull(),
  specs: jsonb("specs").notNull().$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export const offers = pgTable("offers", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id),
  storeId: integer("store_id").notNull().references(() => stores.id),
  price: integer("price").notNull(),
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
  email: text("email").notNull(),
  area: text("area").notNull(),
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
