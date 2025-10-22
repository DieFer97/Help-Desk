import type { NextFunction, Request, Response } from "express"
import type { ZodSchema } from "zod"
import { AppError } from "./errorHandler"

export function validateRequest(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.body)
      req.body = validated
      next()
    } catch (error: any) {
      const message = error.errors?.[0]?.message || "Validación fallida"
      throw new AppError(400, message)
    }
  }
}
