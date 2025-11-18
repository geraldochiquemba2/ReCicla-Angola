// Referenced from blueprint:javascript_database
import type {
  User,
  InsertUser,
  Collection,
  InsertCollection,
  PointTransaction,
  InsertPointTransaction,
  UserStats,
  CollectionWithUsers,
} from "@shared/schema";
import { users, collections, pointTransactions } from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  updateUserPoints(id: string, points: number): Promise<User | undefined>;
  updateUserRecycled(id: string, amount: number): Promise<User | undefined>;

  // Collections
  getCollection(id: string): Promise<Collection | undefined>;
  getCollections(): Promise<Collection[]>;
  getAllCollections(): Promise<Collection[]>;
  getCollectionsByGenerator(generatorId: string): Promise<Collection[]>;
  getCollectionsByRecycler(recyclerId: string): Promise<Collection[]>;
  createCollection(collection: InsertCollection): Promise<Collection>;
  updateCollection(id: string, updates: Partial<Collection>): Promise<Collection | undefined>;

  // Point Transactions
  getPointTransactions(userId: string): Promise<PointTransaction[]>;
  createPointTransaction(transaction: InsertPointTransaction): Promise<PointTransaction>;

  // Stats
  getUserStats(userId: string): Promise<UserStats>;
}

// DatabaseStorage implements IStorage using PostgreSQL via Drizzle ORM
// Referenced from blueprint:javascript_database
export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.phone, phone));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async updateUserPoints(id: string, points: number): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ points: sql`${users.points} + ${points}` })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async updateUserRecycled(id: string, amount: number): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ totalRecycled: sql`CAST(CAST(${users.totalRecycled} AS DECIMAL) + ${amount} AS TEXT)` })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  // Collections
  async getCollection(id: string): Promise<Collection | undefined> {
    const [collection] = await db.select().from(collections).where(eq(collections.id, id));
    return collection || undefined;
  }

  async getCollections(): Promise<Collection[]> {
    return await db.select().from(collections).orderBy(desc(collections.createdAt));
  }

  async getAllCollections(): Promise<Collection[]> {
    return await db.select().from(collections);
  }

  async getCollectionsByGenerator(generatorId: string): Promise<Collection[]> {
    return await db
      .select()
      .from(collections)
      .where(eq(collections.generatorId, generatorId))
      .orderBy(desc(collections.createdAt));
  }

  async getCollectionsByRecycler(recyclerId: string): Promise<Collection[]> {
    return await db
      .select()
      .from(collections)
      .where(eq(collections.recyclerId, recyclerId))
      .orderBy(desc(collections.createdAt));
  }

  async createCollection(insertCollection: InsertCollection): Promise<Collection> {
    const quantity = parseFloat(insertCollection.quantity);
    const pointsGenerated = Math.ceil(quantity * 10);

    const [collection] = await db
      .insert(collections)
      .values({
        ...insertCollection,
        pointsGenerated,
      })
      .returning();
    return collection;
  }

  async updateCollection(
    id: string,
    updates: Partial<Collection>
  ): Promise<Collection | undefined> {
    const [collection] = await db
      .update(collections)
      .set(updates)
      .where(eq(collections.id, id))
      .returning();
    return collection || undefined;
  }

  // Point Transactions
  async getPointTransactions(userId: string): Promise<PointTransaction[]> {
    return await db
      .select()
      .from(pointTransactions)
      .where(eq(pointTransactions.userId, userId))
      .orderBy(desc(pointTransactions.createdAt));
  }

  async createPointTransaction(
    insertTransaction: InsertPointTransaction
  ): Promise<PointTransaction> {
    const [transaction] = await db
      .insert(pointTransactions)
      .values(insertTransaction)
      .returning();
    return transaction;
  }

  // Stats
  async getUserStats(userId: string): Promise<UserStats> {
    const user = await this.getUser(userId);
    if (!user) {
      return {
        totalPoints: 0,
        totalRecycled: 0,
        totalCollections: 0,
        completedCollections: 0,
        availableCollections: 0,
        environmentalImpact: {
          co2Saved: 0,
          treesEquivalent: 0,
          energySaved: 0,
        },
      };
    }

    const userCollections = user.userType === "gerador"
      ? await this.getCollectionsByGenerator(userId)
      : await this.getCollectionsByRecycler(userId);

    const completedCollections = userCollections.filter((c) => c.status === "concluido");
    const totalRecycled = parseFloat(user.totalRecycled || "0");

    const co2Saved = Math.round(totalRecycled * 2);
    const treesEquivalent = Math.round((co2Saved / 21) * 10) / 10;
    const energySaved = Math.round(totalRecycled * 5);

    return {
      totalPoints: user.points,
      totalRecycled,
      totalCollections: userCollections.length,
      completedCollections: completedCollections.length,
      availableCollections: userCollections.filter((c) => c.status === "disponivel").length,
      environmentalImpact: {
        co2Saved,
        treesEquivalent,
        energySaved,
      },
    };
  }
}

export const storage = new DatabaseStorage();
