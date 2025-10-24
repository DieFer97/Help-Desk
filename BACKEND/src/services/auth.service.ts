import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { getEnv } from "../config/env"
import { AppError } from "../middleware/errorHandler"
import { logger } from "../utils/logger"

const prisma = new PrismaClient()
const env = getEnv()

export const authService = {
  async register(email: string, password: string, nombre: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      throw new AppError(400, "El email ya está registrado")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        nombre,
        tipo_usuario: "cliente",
      },
    })

    logger.info(`Usuario registrado: ${email}`)

    const token = jwt.sign({ userId: user.id, email: user.email, tipo_usuario: user.tipo_usuario }, env.JWT_SECRET, {
      expiresIn: "7d",
    })

    return { 
      user: { 
        id: user.id, 
        email: user.email, 
        nombre: user.nombre, 
        tipo_usuario: user.tipo_usuario
      }, 
      token 
    }
  },

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      throw new AppError(401, "Email o contraseña incorrectos")
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
    if (!isPasswordValid) {
      throw new AppError(401, "Email o contraseña incorrectos")
    }

    logger.info(`Usuario inició sesión: ${email}`)

    const token = jwt.sign({ userId: user.id, email: user.email, tipo_usuario: user.tipo_usuario }, env.JWT_SECRET, {
      expiresIn: "7d",
    })

    return { 
      user: { 
        id: user.id, 
        email: user.email, 
        nombre: user.nombre, 
        tipo_usuario: user.tipo_usuario
      }, 
      token 
    }
  },

  async getUser(userId: number) {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw new AppError(404, "Usuario no encontrado")
    }
    return { id: user.id, email: user.email, nombre: user.nombre, tipo_usuario: user.tipo_usuario }
  },
}