export function getEnv() {
  const required = ["DATABASE_URL", "JWT_SECRET", "N8N_WEBHOOK_URL"]
  const missing = required.filter((key) => !process.env[key])

  if (missing.length > 0) {
    throw new Error(`Variables de entorno faltantes: ${missing.join(", ")}`)
  }

  return {
    PORT: Number(process.env.PORT) || 3000,
    DATABASE_URL: process.env.DATABASE_URL!,
    JWT_SECRET: process.env.JWT_SECRET!,
    N8N_WEBHOOK_URL: process.env.N8N_WEBHOOK_URL!,
    NODE_ENV: process.env.NODE_ENV || "development",
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
  }
}
