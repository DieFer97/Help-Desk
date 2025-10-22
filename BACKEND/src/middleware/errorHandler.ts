import type { Request, Response, NextFunction } from "express"

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
  ) {
    super(message)
    this.name = "AppError"
  }
}

export function errorHandler(err: Error | AppError, _req: Request, res: Response, _next: NextFunction) {
  console.error("[ERROR]", err)

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message })
  }

  if (err instanceof SyntaxError) {
    return res.status(400).json({ error: "JSON inválido" })
  }

  res.status(500).json({
    error: "Error interno del servidor",
    ...(process.env.NODE_ENV === "development" && { details: err.message }),
  })
}
