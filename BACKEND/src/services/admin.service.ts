import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const adminService = {
  async getStats() {
    const totalUsers = await prisma.user.count()
    const totalChats = await prisma.chat.count()
    const totalMessages = await prisma.message.count()
    const totalTickets = await prisma.ticket.count()

    const ticketsByPriority = await prisma.ticket.groupBy({
      by: ["prioridad"],
      _count: true,
    })

    const ticketsByStatus = await prisma.ticket.groupBy({
      by: ["estado"],
      _count: true,
    })

    return {
      totalUsers,
      totalChats,
      totalMessages,
      totalTickets,
      ticketsByPriority,
      ticketsByStatus,
    }
  },

  async getAllTickets() {
    const tickets = await prisma.ticket.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: true },
    })

    return tickets
  },

  async updateTicketStatus(ticketId: string, estado: string) {
    const ticket = await prisma.ticket.update({
      where: { id: parseInt(ticketId) },
      data: { estado },
    })

    return ticket
  },
}
