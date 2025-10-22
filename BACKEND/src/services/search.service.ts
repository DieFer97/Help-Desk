import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const searchService = {
  async searchChats(userId: number, query: string) {
    const chats = await prisma.chat.findMany({
      where: {
        userId,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { messages: { some: { content: { contains: query, mode: "insensitive" } } } },
        ],
      },
      include: { messages: true },
    })

    return chats
  },

  async searchMessages(userId: number, query: string) {
    const messages = await prisma.message.findMany({
      where: {
        chat: { userId },
        content: { contains: query, mode: "insensitive" },
      },
      include: { chat: true },
    })

    return messages
  },

  async searchTickets(userId: number, query: string) {
    const tickets = await prisma.ticket.findMany({
      where: {
        userId,
        OR: [
          { asunto: { contains: query, mode: "insensitive" } },
          { detalle: { contains: query, mode: "insensitive" } },
          { ticketId: { contains: query, mode: "insensitive" } },
        ],
      },
    })

    return tickets
  },
}
