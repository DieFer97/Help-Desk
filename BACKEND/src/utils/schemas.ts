import { z } from "zod"

export const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Contraseña debe tener al menos 6 caracteres"),
  clienteNombre: z.string().min(2, "Nombre debe tener al menos 2 caracteres"),
})

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Contraseña requerida"),
})

export const createChatSchema = z.object({
  title: z.string().min(1, "Título requerido"),
})

export const createMessageSchema = z.object({
  content: z.string().min(1, "Mensaje no puede estar vacío"),
  imageUrl: z.string().optional(),
})

export const createTicketSchema = z.object({
  asunto: z.string().min(1, "Asunto requerido"),
  detalle: z.string().min(1, "Detalle requerido"),
  prioridad: z.enum(["baja", "media", "alta", "crítica"]),
})

export const searchSchema = z.object({
  query: z.string().min(1, "Búsqueda requerida"),
  type: z.enum(["chats", "messages", "tickets"]).optional(),
})
