import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertNotificationSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Webhook endpoint for CRM notifications
  app.post("/api/webhook", async (req, res) => {
    try {
      const notification = insertNotificationSchema.parse(req.body);
      const created = await storage.createNotification(notification);
      
      // Get all subscriptions to send notifications
      const subscriptions = await storage.getAllSubscriptions();
      
      // In a real app, we would send push notifications here
      console.log(`Sending notification to ${subscriptions.length} subscribers`);
      
      res.json(created);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: fromZodError(error).message });
        return;
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Save push subscription
  app.post("/api/subscriptions", async (req, res) => {
    try {
      const subscription = await storage.saveUserSubscription({
        subscription: JSON.stringify(req.body)
      });
      res.json(subscription);
    } catch (error) {
      res.status(500).json({ error: "Failed to save subscription" });
    }
  });

  // Get notifications for analytics
  app.get("/api/notifications", async (_req, res) => {
    try {
      const notifications = await storage.getNotifications();
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  // Track notification clicks
  app.post("/api/notifications/:id/click", async (req, res) => {
    try {
      await storage.markNotificationClicked(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to track click" });
    }
  });

  return httpServer;
}
