import { PrismaClient } from "@prisma/client"
import { AppError } from "../middleware/errorHandler"
import { logger } from "../utils/logger"

const prisma = new PrismaClient()

export const ticketService = {
  async createTicket(userId: number, asunto: string, detalle: string, prioridad: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw new AppError(404, "Usuario no encontrado")
    }

    const ticket = await prisma.ticket.create({
      data: {
        userId,
        asunto,
        detalle,
        prioridad,
        estado: "pendiente",
        ticketId: `TKT-${Date.now()}`,
        clienteNombre: user.nombre,
      },
    })

    logger.info(`Ticket creado: ${ticket.ticketId}`)
    return ticket
  },

  async getUserTickets(userId: number) {
    const tickets = await prisma.ticket.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })

    return tickets
  },

  async getTicket(ticketId: number, userId: number) {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    })

    if (!ticket || ticket.userId !== userId) {
      throw new AppError(404, "Ticket no encontrado")
    }

    return ticket
  },

  async updateTicketStatus(ticketId: number, userId: number, estado: string) {
    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } })
    if (!ticket || ticket.userId !== userId) {
      throw new AppError(404, "Ticket no encontrado")
    }

    const updated = await prisma.ticket.update({
      where: { id: ticketId },
      data: { estado },
    })

    logger.info(`Ticket actualizado: ${ticketId} - Estado: ${estado}`)
    return updated
  },
}
