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
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPoints(id: string, points: number): Promise<User | undefined>;
  updateUserRecycled(id: string, amount: number): Promise<User | undefined>;

  // Collections
  getCollection(id: string): Promise<Collection | undefined>;
  getCollections(): Promise<Collection[]>;
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

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private collections: Map<string, Collection>;
  private pointTransactions: Map<string, PointTransaction>;

  constructor() {
    this.users = new Map();
    this.collections = new Map();
    this.pointTransactions = new Map();
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      points: 0,
      totalRecycled: "0",
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserPoints(id: string, points: number): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, points: user.points + points };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateUserRecycled(id: string, amount: number): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const currentRecycled = parseFloat(user.totalRecycled || "0");
    const updatedUser = {
      ...user,
      totalRecycled: (currentRecycled + amount).toFixed(2),
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Collections
  async getCollection(id: string): Promise<Collection | undefined> {
    return this.collections.get(id);
  }

  async getCollections(): Promise<Collection[]> {
    return Array.from(this.collections.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getCollectionsByGenerator(generatorId: string): Promise<Collection[]> {
    return Array.from(this.collections.values())
      .filter((c) => c.generatorId === generatorId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getCollectionsByRecycler(recyclerId: string): Promise<Collection[]> {
    return Array.from(this.collections.values())
      .filter((c) => c.recyclerId === recyclerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createCollection(insertCollection: InsertCollection): Promise<Collection> {
    const id = randomUUID();
    
    // Calculate points based on quantity (10 points per kg)
    const quantity = parseFloat(insertCollection.quantity);
    const pointsGenerated = Math.ceil(quantity * 10);

    const collection: Collection = {
      id,
      ...insertCollection,
      status: "disponivel",
      recyclerId: null,
      pointsGenerated,
      createdAt: new Date(),
      acceptedAt: null,
      completedAt: null,
    };

    this.collections.set(id, collection);
    return collection;
  }

  async updateCollection(
    id: string,
    updates: Partial<Collection>
  ): Promise<Collection | undefined> {
    const collection = this.collections.get(id);
    if (!collection) return undefined;

    const updatedCollection = { ...collection, ...updates };
    this.collections.set(id, updatedCollection);
    return updatedCollection;
  }

  // Point Transactions
  async getPointTransactions(userId: string): Promise<PointTransaction[]> {
    return Array.from(this.pointTransactions.values())
      .filter((t) => t.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createPointTransaction(
    insertTransaction: InsertPointTransaction
  ): Promise<PointTransaction> {
    const id = randomUUID();
    const transaction: PointTransaction = {
      id,
      ...insertTransaction,
      createdAt: new Date(),
    };

    this.pointTransactions.set(id, transaction);
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

    const collections = user.userType === "gerador"
      ? await this.getCollectionsByGenerator(userId)
      : await this.getCollectionsByRecycler(userId);

    const completedCollections = collections.filter((c) => c.status === "concluido");
    const totalRecycled = parseFloat(user.totalRecycled || "0");

    // Calculate environmental impact
    // 1 kg of recyclables = ~2 kg CO2 saved
    // 1 tree absorbs ~21 kg CO2 per year
    // 1 kg of recyclables = ~5 kWh energy saved
    const co2Saved = Math.round(totalRecycled * 2);
    const treesEquivalent = Math.round((co2Saved / 21) * 10) / 10;
    const energySaved = Math.round(totalRecycled * 5);

    return {
      totalPoints: user.points,
      totalRecycled,
      totalCollections: collections.length,
      completedCollections: completedCollections.length,
      availableCollections: collections.filter((c) => c.status === "disponivel").length,
      environmentalImpact: {
        co2Saved,
        treesEquivalent,
        energySaved,
      },
    };
  }
}

export const storage = new MemStorage();
