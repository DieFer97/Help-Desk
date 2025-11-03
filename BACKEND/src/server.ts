import { PrismaClient } from "@prisma/client"
import cors from "cors"
import "dotenv/config"
import express, { type Request, type Response } from "express"
import rateLimit from "express-rate-limit"
import helmet from "helmet"

import adminRoutes from "./routes/admin"
import authRoutes from "./routes/auth"
import chatRoutes from "./routes/chat"
import searchRoutes from "./routes/search"
import ticketRoutes from "./routes/tickets"
import uploadRoutes from "./routes/upload";

import { authMiddleware } from "./middleware/auth"
import { errorHandler } from "./middleware/errorHandler"

import { getEnv } from "./config/env"

const app = express()
const prisma = new PrismaClient()
const env = getEnv()

app.use(helmet())

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:8080',
        'http://localhost:3000',
        process.env.FRONTEND_URL
      ].filter(Boolean)

      if (!origin) {
        return callback(null, true)
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('No permitido por CORS'))
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
)

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Demasiadas solicitudes desde esta IP, intenta más tarde.",
})

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Demasiados intentos de login, intenta en 15 minutos.",
  skip: (req) => req.method !== "POST",
})

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: "Demasiados registros desde esta IP, intenta más tarde.",
  skip: (req) => req.method !== "POST",
})

app.use(limiter)

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ limit: "10mb", extended: true }))

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

app.use("/api/auth", loginLimiter, registerLimiter, authRoutes)
app.use("/api/chats", authMiddleware, chatRoutes)
app.use("/api/upload", authMiddleware, uploadRoutes)

app.use("/api/tickets", (req, res, next) => {
  if (req.path === "/stats" || req.path === "/" || req.path === "/recent-queries") {
    return next()
  }
  return authMiddleware(req, res, next)
}, ticketRoutes)

app.use("/api/admin", authMiddleware, adminRoutes)
app.use("/api/search", authMiddleware, searchRoutes)

app.post("/api/classify", (_req: Request, res: Response) => {
  return res.status(410).json({
    error: "Funcionalidad de clasificación por embeddings/Qdrant deshabilitada",
  })
})

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Ruta no encontrada" })
})

app.use(errorHandler)

process.on("SIGINT", async () => {
  console.log("Cerrando servidor...")
  await prisma.$disconnect()
  process.exit(0)
})

const PORT = env.PORT
app.listen(PORT, () => {
  console.log(`✅ API escuchando en http://localhost:${PORT}`)
  console.log(`✅ Base de datos: ${env.DATABASE_URL.split("@")[1]}`)
  console.log(`✅ Cloudinary configurado: ${env.CLOUDINARY_CLOUD_NAME}`)
})

export default app