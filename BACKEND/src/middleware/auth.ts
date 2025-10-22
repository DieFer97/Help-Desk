import type { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { getEnv } from "../config/env"

export interface AuthRequest extends Request {
  userId?: string
  user?: { id: string; email: string; tipo_usuario: string }
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" })
  }

  try {
    const env = getEnv()
    const decoded = jwt.verify(token, env.JWT_SECRET) as any
    req.userId = decoded.userId
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado" })
  }
}
