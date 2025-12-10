import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { insertPilotSignupSchema, insertClickEventSchema } from "../shared/schema.js";
import { fromError } from "zod-validation-error";
import crypto from "crypto";

const ADMIN_TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

function getTokenSecret(): string | null {
  return process.env.ADMIN_PASSWORD || null;
}

function generateToken(): string | null {
  const secret = getTokenSecret();
  if (!secret) return null;
  const timestamp = Date.now().toString();
  const randomBytes = crypto.randomBytes(32).toString("hex");
  const payload = `${timestamp}:${randomBytes}`;
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return Buffer.from(`${payload}:${signature}`).toString("base64");
}

function validateToken(token: string): boolean {
  const secret = getTokenSecret();
  if (!secret) return false;
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const parts = decoded.split(":");
    if (parts.length !== 3) return false;
    const [timestampStr, randomBytes, signature] = parts;
    const timestamp = parseInt(timestampStr, 10);
    if (isNaN(timestamp)) return false;
    if (Date.now() - timestamp >= ADMIN_TOKEN_EXPIRY) return false;
    const payload = `${timestampStr}:${randomBytes}`;
    const expectedSignature = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  } catch {
    return false;
  }
}

export function registerRoutes(
  httpServer: Server,
  app: Express
): Server {

  // Stores
  app.get("/api/stores", async (req, res) => {
    try {
      const allStores = await storage.getAllStores();
      res.json(allStores);
    } catch (error) {
      console.error("Error fetching stores:", error);
      res.status(500).json({ error: "Failed to fetch stores" });
    }
  });

  app.get("/api/stores/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const store = await storage.getStoreById(id);
      if (!store) {
        return res.status(404).json({ error: "Store not found" });
      }
      res.json(store);
    } catch (error) {
      console.error("Error fetching store:", error);
      res.status(500).json({ error: "Failed to fetch store" });
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const allProducts = await storage.getAllProducts();
      res.json(allProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/search", async (req, res) => {
    try {
      const query = req.query.q as string || '';
      const results = await storage.searchProducts(query);
      res.json(results);
    } catch (error) {
      console.error("Error searching products:", error);
      res.status(500).json({ error: "Failed to search products" });
    }
  });

  // Offers
  app.get("/api/offers", async (req, res) => {
    try {
      const productId = req.query.productId ? parseInt(req.query.productId as string) : undefined;
      const storeId = req.query.storeId ? parseInt(req.query.storeId as string) : undefined;

      if (productId) {
        const offers = await storage.getOffersByProductId(productId);
        return res.json(offers);
      }

      if (storeId) {
        const offers = await storage.getOffersByStoreId(storeId);
        return res.json(offers);
      }

      const allOffers = await storage.getAllOffers();
      res.json(allOffers);
    } catch (error) {
      console.error("Error fetching offers:", error);
      res.status(500).json({ error: "Failed to fetch offers" });
    }
  });

  // Pilot Signups
  app.post("/api/pilot-signup", async (req, res) => {
    try {
      const validation = insertPilotSignupSchema.safeParse(req.body);
      if (!validation.success) {
        const readableError = fromError(validation.error);
        return res.status(400).json({ error: readableError.message });
      }

      const signup = await storage.createPilotSignup(validation.data);
      res.status(201).json(signup);
    } catch (error) {
      console.error("Error creating pilot signup:", error);
      res.status(500).json({ error: "Failed to create signup" });
    }
  });

  // Click Event Tracking
  app.post("/api/track-event", async (req, res) => {
    try {
      const validation = insertClickEventSchema.safeParse(req.body);
      if (!validation.success) {
        const readableError = fromError(validation.error);
        return res.status(400).json({ error: readableError.message });
      }

      const event = await storage.trackClickEvent({
        ...validation.data,
        ipAddress: req.ip || req.connection.remoteAddress
      });
      res.status(201).json(event);
    } catch (error) {
      console.error("Error tracking event:", error);
      res.status(500).json({ error: "Failed to track event" });
    }
  });

  app.post("/api/track-batch", async (req, res) => {
    try {
      const { events } = req.body;
      if (!Array.isArray(events)) {
        return res.status(400).json({ error: "Invalid format. Expected { events: [] }" });
      }

      // Basic validation/sanitization could go here
      // For speed, strict schema validation might be skipped or done in parallel
      // But let's map them to make sure they match the schema keys

      const cleanEvents = events.map(e => ({
        eventType: e.type, // Map 'type' from frontend to 'eventType' in DB
        sessionId: e.sessionId,
        ipAddress: req.ip || req.connection.remoteAddress,
        metadata: e.data, // Store extra data in metadata
        // Optional fields
        productId: e.data?.productId,
        storeId: e.data?.storeId,
        offerId: e.data?.offerId,
        searchQuery: e.data?.searchQuery
      }));

      await storage.trackEventBatch(cleanEvents);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error tracking batch:", error);
      res.status(500).json({ error: "Failed to track batch" });
    }
  });

  // Admin Authentication
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { password } = req.body;
      const adminPassword = process.env.ADMIN_PASSWORD;

      if (!adminPassword) {
        console.error("ADMIN_PASSWORD not configured");
        return res.status(500).json({ error: "Admin authentication not configured" });
      }

      if (password !== adminPassword) {
        return res.status(401).json({ error: "Invalid password" });
      }

      const token = generateToken();
      res.json({ token });
    } catch (error) {
      console.error("Error in admin login:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.get("/api/admin/verify", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
      }

      const token = authHeader.substring(7);
      if (!validateToken(token)) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }

      res.json({ valid: true });
    } catch (error) {
      console.error("Error verifying token:", error);
      res.status(500).json({ error: "Verification failed" });
    }
  });

  // Admin Analytics (protected)
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
      }
      const token = authHeader.substring(7);
      if (!validateToken(token)) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }

      const stats = await storage.getClickStats();
      const signups = await storage.getAllPilotSignups();
      res.json({
        ...stats,
        signupCount: signups.length,
        recentSignups: signups.slice(0, 10)
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.delete("/api/admin/stats", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
      }
      const token = authHeader.substring(7);
      if (!validateToken(token)) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }

      await storage.resetAnalytics();
      res.json({ success: true, message: "Analytics reset successfully" });
    } catch (error) {
      console.error("Error resetting stats:", error);
      res.status(500).json({ error: "Failed to reset stats" });
    }
  });

  // AI Insight Generator
  function generateInsights(
    stats: {
      totalClicks: number,
      uniqueVisitors: number,
      uniqueCheckoutVisitors: number,
      checkoutClicks: number,
      paymentClicks: number,
      paymentMethods: { method: string, count: number }[],
      topSearches: { query: string, count: number }[]
    },
    signupCount: number
  ): string[] {
    const insights: string[] = [];

    // 1. Conversion Analysis
    if (stats.uniqueVisitors > 0) {
      const checkoutRate = (stats.uniqueCheckoutVisitors / stats.uniqueVisitors) * 100;
      const signupRate = (signupCount / stats.uniqueVisitors) * 100;

      if (checkoutRate < 5) {
        insights.push(`⚠️ Low Checkout Conversion (${checkoutRate.toFixed(1)}%). Users are browsing but not buying. Check pricing.`);
      } else if (checkoutRate > 15) {
        insights.push(`🚀 Strong Purchase Intent! ${checkoutRate.toFixed(1)}% of visitors attempt checkout.`);
      }

      if (signupRate > 10) {
        insights.push(`⭐ High Lead Capture: ${signupRate.toFixed(1)}% of visitors are joining the waitlist.`);
      }
    } else if (stats.totalClicks > 0) {
      // Fallback if uniqueVisitors is 0 (legacy data)
      insights.push("ℹ️ Gathering visitor data. Click activity detected.");
    }

    // 2. Payment Preferences
    if (stats.paymentMethods.length > 0) {
      const totalPayments = stats.paymentMethods.reduce((a, b) => a + b.count, 0);
      const upi = stats.paymentMethods.find(p => p.method === 'upi')?.count || 0;
      const cod = stats.paymentMethods.find(p => p.method === 'cod')?.count || 0;

      if ((upi / totalPayments) > 0.6) {
        insights.push("💳 Digital Native Audience: UPI is heavily preferred (>60%). Ensure QR codes are prominent.");
      }
      if ((cod / totalPayments) > 0.4) {
        insights.push("🏠 Traditional Buyers: High COD demand (>40%). Logistics partner must support cash handling.");
      }
    }

    // 3. Demand Signals
    if (stats.topSearches.length > 0) {
      const topTerm = stats.topSearches[0].query;
      insights.push(`🔍 Top Search Trend: Users are actively looking for "${topTerm}". Consider stocking more variations.`);
    }

    if (insights.length === 0) {
      insights.push("Waiting for more data to generate smart insights...");
    }

    return insights;
  }

  app.post("/api/admin/analyze", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
      }
      const token = authHeader.substring(7);
      if (!validateToken(token)) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }

      const stats = await storage.getClickStats();
      const signups = await storage.getAllPilotSignups();

      const insights = generateInsights(stats, signups.length);
      res.json({ insights });
    } catch (error) {
      console.error("Error analyzing data:", error);
      res.status(500).json({ error: "Failed to generate insights" });
    }

  });

  // Settings Routes
  app.get("/api/settings", async (req, res) => {
    try {
      const mode = await storage.getSetting("pricing_mode");
      res.json({ pricing_mode: mode || "dynamic" });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.post("/api/admin/settings", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
      }
      const token = authHeader.substring(7);
      if (!validateToken(token)) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }

      const { key, value } = req.body;
      if (!key || !value) return res.status(400).json({ error: "Missing key or value" });

      const updated = await storage.updateSetting(key, value);
      res.json({ success: true, value: updated });
    } catch (error) {
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  return httpServer;
}
