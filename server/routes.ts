import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import {
  insertUserSchema,
  loginSchema,
  insertCollectionSchema,
  updateProfileSchema,
  type CollectionWithUsers,
} from "@shared/schema";
import { ZodError } from "zod";

const JWT_SECRET = process.env.SESSION_SECRET || "recicla-angola-secret-key";

// Normalize phone numbers to canonical format: +244XXXXXXXXX
// This ensures all Angolan numbers are stored consistently
function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, ''); // Remove all non-digits
  
  // If starts with 244, prepend +, otherwise prepend +244
  if (digits.startsWith('244')) {
    return '+' + digits;
  } else {
    return '+244' + digits;
  }
}

function createToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

function verifyToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Remove sensitive data from user object before sending to client
function sanitizeUser(user: any) {
  const { password, ...safeUser } = user;
  return safeUser;
}

// Auth middleware
async function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Não autenticado" });
  }

  const userId = verifyToken(token);
  if (!userId) {
    return res.status(401).json({ message: "Token inválido" });
  }

  const user = await storage.getUser(userId);
  if (!user) {
    return res.status(401).json({ message: "Utilizador não encontrado" });
  }

  // CRITICAL: Always sanitize user before attaching to request to prevent password leaks
  (req as any).user = sanitizeUser(user);
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(express.json());

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      const normalizedPhone = normalizePhone(data.phone);

      // Check if phone already exists (normalized comparison)
      const allUsers = await storage.getAllUsers();
      const existingPhone = allUsers.find(u => normalizePhone(u.phone) === normalizedPhone);
      if (existingPhone) {
        return res.status(400).json({ message: "Número de telefone já está registado" });
      }

      // Hash password before storing
      const hashedPassword = await hashPassword(data.password);
      const user = await storage.createUser({ ...data, phone: normalizedPhone, password: hashedPassword });
      const token = createToken(user.id);

      res.json({ user: sanitizeUser(user), token });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Erro ao criar conta" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const data = loginSchema.parse(req.body);
      const normalizedPhone = normalizePhone(data.phone);

      // Find user with normalized phone comparison
      const allUsers = await storage.getAllUsers();
      const user = allUsers.find(u => normalizePhone(u.phone) === normalizedPhone);
      
      if (!user) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      const isValidPassword = await comparePassword(data.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      const token = createToken(user.id);
      res.json({ user: sanitizeUser(user), token });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Erro ao fazer login" });
    }
  });

  // Update profile
  app.put("/api/user/profile", requireAuth, async (req, res) => {
    try {
      const user = (req as any).user;
      const data = updateProfileSchema.parse(req.body);

      // Check if phone is being changed and if it's already in use
      if (data.phone) {
        const normalizedPhone = normalizePhone(data.phone);
        const allUsers = await storage.getAllUsers();
        const existingPhone = allUsers.find(u => 
          normalizePhone(u.phone) === normalizedPhone && u.id !== user.id
        );
        if (existingPhone) {
          return res.status(400).json({ message: "Número de telefone já está em uso" });
        }
        data.phone = normalizedPhone;
      }

      // Check if email is being changed and if it's already in use
      if (data.email) {
        const allUsers = await storage.getAllUsers();
        const existingEmail = allUsers.find(u => 
          u.email === data.email && u.id !== user.id
        );
        if (existingEmail) {
          return res.status(400).json({ message: "Email já está em uso" });
        }
      }

      const updatedUser = await storage.updateUser(user.id, data);
      if (!updatedUser) {
        return res.status(404).json({ message: "Utilizador não encontrado" });
      }

      res.json({ user: sanitizeUser(updatedUser) });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Erro ao atualizar perfil" });
    }
  });

  // Platform stats (public)
  app.get("/api/platform/stats", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const collections = await storage.getAllCollections();
      
      let totalKgRecycled = 0;
      collections.forEach(collection => {
        if (collection.status === "concluido") {
          totalKgRecycled += parseFloat(collection.quantity);
        }
      });

      res.json({
        totalUsers: users.length,
        totalKgRecycled: totalKgRecycled,
        totalCollections: collections.length,
      });
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar estatísticas" });
    }
  });

  // Stats route
  app.get("/api/stats", requireAuth, async (req, res) => {
    try {
      const user = (req as any).user;
      const stats = await storage.getUserStats(user.id);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar estatísticas" });
    }
  });

  // Collections routes (public - no auth required to view)
  app.get("/api/collections", async (req, res) => {
    try {
      const collections = await storage.getCollections();
      
      // Enrich with user data (sanitized)
      const collectionsWithUsers: CollectionWithUsers[] = await Promise.all(
        collections.map(async (collection) => {
          const generator = await storage.getUser(collection.generatorId);
          const recycler = collection.recyclerId
            ? await storage.getUser(collection.recyclerId)
            : undefined;

          return {
            ...collection,
            generator: generator ? sanitizeUser(generator) : undefined,
            recycler: recycler ? sanitizeUser(recycler) : undefined,
          };
        })
      );

      res.json(collectionsWithUsers);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar recolhas" });
    }
  });

  app.post("/api/collections", requireAuth, async (req, res) => {
    try {
      const user = (req as any).user;

      if (user.userType !== "gerador") {
        return res.status(403).json({ message: "Apenas geradores podem criar recolhas" });
      }

      const data = insertCollectionSchema.parse(req.body);
      const collection = await storage.createCollection({
        ...data,
        generatorId: user.id,
      });

      // Award points to generator for making waste available
      const pointsForAvailability = Math.ceil(parseFloat(data.quantity) * 2); // 2 points per kg for availability
      await storage.updateUserPoints(user.id, pointsForAvailability);

      // Create transaction record
      await storage.createPointTransaction({
        userId: user.id,
        type: "ganho_disponibilizacao",
        points: pointsForAvailability,
        description: `Disponibilização de ${data.quantity}kg de resíduos`,
        collectionId: collection.id,
      });

      res.json(collection);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Erro ao criar recolha" });
    }
  });

  app.post("/api/collections/:id/accept", requireAuth, async (req, res) => {
    try {
      const user = (req as any).user;
      const { id } = req.params;

      if (user.userType !== "reciclador") {
        return res.status(403).json({ message: "Apenas recicladores podem aceitar recolhas" });
      }

      const collection = await storage.getCollection(id);
      if (!collection) {
        return res.status(404).json({ message: "Recolha não encontrada" });
      }

      if (collection.status !== "disponivel") {
        return res.status(400).json({ message: "Recolha não está disponível" });
      }

      const updated = await storage.updateCollection(id, {
        status: "aceito",
        recyclerId: user.id,
        acceptedAt: new Date(),
      });

      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Erro ao aceitar recolha" });
    }
  });

  app.post("/api/collections/:id/complete", requireAuth, async (req, res) => {
    try {
      const user = (req as any).user;
      const { id } = req.params;

      if (user.userType !== "reciclador") {
        return res.status(403).json({ message: "Apenas recicladores podem concluir recolhas" });
      }

      const collection = await storage.getCollection(id);
      if (!collection) {
        return res.status(404).json({ message: "Recolha não encontrada" });
      }

      if (collection.status !== "aceito") {
        return res.status(400).json({ message: "Recolha não foi aceita" });
      }

      if (collection.recyclerId !== user.id) {
        return res.status(403).json({ message: "Você não aceitou esta recolha" });
      }

      const updated = await storage.updateCollection(id, {
        status: "concluido",
        completedAt: new Date(),
      });

      if (updated) {
        // Award points to recycler for completing collection
        await storage.updateUserPoints(user.id, updated.pointsGenerated);
        await storage.updateUserRecycled(user.id, parseFloat(updated.quantity));

        // Update generator's recycled total
        await storage.updateUserRecycled(updated.generatorId, parseFloat(updated.quantity));

        // Create transaction record
        await storage.createPointTransaction({
          userId: user.id,
          type: "ganho_recolha",
          points: updated.pointsGenerated,
          description: `Recolha de ${updated.quantity}kg de resíduos concluída`,
          collectionId: updated.id,
        });
      }

      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Erro ao concluir recolha" });
    }
  });

  app.post("/api/collections/:id/cancel", requireAuth, async (req, res) => {
    try {
      const user = (req as any).user;
      const { id } = req.params;

      const collection = await storage.getCollection(id);
      if (!collection) {
        return res.status(404).json({ message: "Recolha não encontrada" });
      }

      if (collection.generatorId !== user.id) {
        return res.status(403).json({ message: "Você não pode cancelar esta recolha" });
      }

      if (collection.status !== "disponivel") {
        return res.status(400).json({ message: "Apenas recolhas disponíveis podem ser canceladas" });
      }

      const updated = await storage.updateCollection(id, {
        status: "cancelado",
      });

      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Erro ao cancelar recolha" });
    }
  });

  // Point transactions history
  app.get("/api/points/history", requireAuth, async (req, res) => {
    try {
      const user = (req as any).user;
      const transactions = await storage.getPointTransactions(user.id);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar histórico" });
    }
  });

  // Configure multer for file uploads
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
      }
    }),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|gif|webp/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
      
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error("Apenas imagens são permitidas (JPEG, PNG, GIF, WEBP)"));
      }
    }
  });

  // Upload endpoint
  app.post("/api/upload", requireAuth, upload.single("photo"), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Nenhum arquivo foi enviado" });
      }

      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({ url: fileUrl });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Erro ao fazer upload" });
    }
  });

  // Serve uploaded files
  app.use("/uploads", express.static(uploadDir));

  const httpServer = createServer(app);
  return httpServer;
}
