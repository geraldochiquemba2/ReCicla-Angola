import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Tipos de utilizador
export type UserType = "gerador" | "reciclador";

// Tipos de resíduos recicláveis
export type WasteType = "plastico" | "papel" | "vidro" | "metal" | "eletronicos" | "organico";

// Status de pedidos de recolha
export type CollectionStatus = "disponivel" | "aceito" | "concluido" | "cancelado";

// Tipo de transação de pontos
export type TransactionType = "ganho_recolha" | "ganho_disponibilizacao" | "gasto" | "conversao";

// Tabela de Utilizadores
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  userType: text("user_type").notNull().$type<UserType>(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  address: text("address"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  points: integer("points").notNull().default(0),
  totalRecycled: decimal("total_recycled", { precision: 10, scale: 2 }).default("0"), // em kg
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Tabela de Pedidos de Recolha
export const collections = pgTable("collections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  generatorId: varchar("generator_id").notNull(), // quem criou o pedido
  wasteType: text("waste_type").notNull().$type<WasteType>(),
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(), // em kg
  description: text("description"),
  photoUrl: text("photo_url"),
  address: text("address").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  status: text("status").notNull().$type<CollectionStatus>().default("disponivel"),
  recyclerId: varchar("recycler_id"), // quem aceitou
  pointsGenerated: integer("points_generated").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  acceptedAt: timestamp("accepted_at"),
  completedAt: timestamp("completed_at"),
});

// Tabela de Transações de Pontos
export const pointTransactions = pgTable("point_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  type: text("type").notNull().$type<TransactionType>(),
  points: integer("points").notNull(),
  description: text("description").notNull(),
  collectionId: varchar("collection_id"), // referência opcional à recolha
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Schemas de inserção
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email("Email inválido"),
  username: z.string().min(3, "Nome de utilizador deve ter pelo menos 3 caracteres"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  fullName: z.string().min(3, "Nome completo deve ter pelo menos 3 caracteres"),
  userType: z.enum(["gerador", "reciclador"]),
  phone: z.string().optional(),
  address: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
}).omit({
  id: true,
  points: true,
  totalRecycled: true,
  createdAt: true,
});

export const insertCollectionSchema = createInsertSchema(collections, {
  wasteType: z.enum(["plastico", "papel", "vidro", "metal", "eletronicos", "organico"]),
  quantity: z.string().refine((val) => parseFloat(val) > 0, "Quantidade deve ser maior que 0"),
  description: z.string().optional(),
  photoUrl: z.string().optional(),
  address: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres"),
  latitude: z.string(),
  longitude: z.string(),
}).omit({
  id: true,
  status: true,
  recyclerId: true,
  pointsGenerated: true,
  createdAt: true,
  acceptedAt: true,
  completedAt: true,
});

export const insertPointTransactionSchema = createInsertSchema(pointTransactions, {
  type: z.enum(["ganho_recolha", "ganho_disponibilizacao", "gasto", "conversao"]),
  points: z.number().int(),
  description: z.string(),
  collectionId: z.string().optional(),
}).omit({
  id: true,
  createdAt: true,
});

// Tipos TypeScript
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Collection = typeof collections.$inferSelect;
export type InsertCollection = z.infer<typeof insertCollectionSchema>;

export type PointTransaction = typeof pointTransactions.$inferSelect;
export type InsertPointTransaction = z.infer<typeof insertPointTransactionSchema>;

// Schema de login
export const loginSchema = z.object({
  username: z.string().min(1, "Nome de utilizador é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export type LoginData = z.infer<typeof loginSchema>;

// Tipos auxiliares para o frontend
export interface CollectionWithUsers extends Collection {
  generator?: User;
  recycler?: User;
}

export interface UserStats {
  totalPoints: number;
  totalRecycled: number;
  totalCollections: number;
  completedCollections: number;
  availableCollections: number;
  environmentalImpact: {
    co2Saved: number; // kg de CO2
    treesEquivalent: number;
    energySaved: number; // kWh
  };
}
