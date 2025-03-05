import { 
  notifications, type Notification, type InsertNotification,
  users, type User, type InsertUser
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Notification methods
  createNotification(notification: InsertNotification): Promise<Notification>;
  getNotifications(): Promise<Notification[]>;
  markNotificationDelivered(id: number): Promise<void>;
  markNotificationClicked(id: number): Promise<void>;

  // User subscription methods
  saveUserSubscription(subscription: InsertUser): Promise<User>;
  getAllSubscriptions(): Promise<User[]>;
}

export class DatabaseStorage implements IStorage {
  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [created] = await db
      .insert(notifications)
      .values(notification)
      .returning();
    return created;
  }

  async getNotifications(): Promise<Notification[]> {
    return await db.select().from(notifications);
  }

  async markNotificationDelivered(id: number): Promise<void> {
    await db
      .update(notifications)
      .set({ delivered: true })
      .where(eq(notifications.id, id));
  }

  async markNotificationClicked(id: number): Promise<void> {
    await db
      .update(notifications)
      .set({ clicked: true })
      .where(eq(notifications.id, id));
  }

  async saveUserSubscription(subscription: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(subscription)
      .returning();
    return user;
  }

  async getAllSubscriptions(): Promise<User[]> {
    return await db.select().from(users);
  }
}

export const storage = new DatabaseStorage();