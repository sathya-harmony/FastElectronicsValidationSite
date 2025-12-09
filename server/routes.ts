import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPilotSignupSchema, insertClickEventSchema } from "@shared/schema";
import { fromError } from "zod-validation-error";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
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

      const event = await storage.trackClickEvent(validation.data);
      res.status(201).json(event);
    } catch (error) {
      console.error("Error tracking event:", error);
      res.status(500).json({ error: "Failed to track event" });
    }
  });

  // Admin Analytics
  app.get("/api/admin/stats", async (req, res) => {
    try {
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

  return httpServer;
}
