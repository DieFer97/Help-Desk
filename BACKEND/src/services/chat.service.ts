import { PrismaClient } from "@prisma/client"
import axios from "axios"
import { getEnv } from "../config/env"
import { AppError } from "../middleware/errorHandler"
import { logger } from "../utils/logger"

const prisma = new PrismaClient()
const env = getEnv()

export const chatService = {
  async createChat(userId: number, title: string) {
    const chat = await prisma.chat.create({
      data: {
        userId,
        title,
        lastMessage: "",
      },
    })

    logger.info(`Chat creado: ${chat.id} para usuario ${userId}`)
    return chat
  },

  async getUserChats(userId: number) {
    const chats = await prisma.chat.findMany({
      where: { userId },
      orderBy: { id: "desc" },
      include: { messages: { take: 1, orderBy: { id: "desc" } } },
    })

    return chats
  },

  async getChat(chatId: number, userId: number) {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: { messages: { orderBy: { id: "asc" } } },
    })

    if (!chat || chat.userId !== userId) {
      throw new AppError(404, "Chat no encontrado")
    }

    return chat
  },

  async addMessage(chatId: number, userId: number, content: string, imageUrl?: string) {
    const chat = await prisma.chat.findUnique({ where: { id: chatId } })
    if (!chat || chat.userId !== userId) {
      throw new AppError(404, "Chat no encontrado")
    }

    // Save user message
    const userMessage = await prisma.message.create({
      data: {
        chatId,
        content,
        imageUrl,
      },
    })

    // Call N8n webhook
    try {
      const response = await axios.post(env.N8N_WEBHOOK_URL, {
        message: content,
        imageUrl,
        userId,
        chatId,
        clienteNombre: chat.title,
      })

      // Save AI response
      const aiMessage = await prisma.message.create({
        data: {
          chatId,
          content: response.data.response || "No se pudo procesar la solicitud",
        },
      })

      // Update chat lastMessage
      await prisma.chat.update({
        where: { id: chatId },
        data: { lastMessage: content },
      })

      logger.info(`Mensaje procesado en chat ${chatId}`)
      return { userMessage, aiMessage }
    } catch (error) {
      logger.error(`Error llamando N8n webhook: ${error}`)
      throw new AppError(500, "Error procesando mensaje")
    }
  },

  async deleteChat(chatId: number, userId: number) {
    const chat = await prisma.chat.findUnique({ where: { id: chatId } })
    if (!chat || chat.userId !== userId) {
      throw new AppError(404, "Chat no encontrado")
    }

    await prisma.message.deleteMany({ where: { chatId } })
    await prisma.chat.delete({ where: { id: chatId } })

    logger.info(`Chat eliminado: ${chatId}`)
    return { success: true }
  },
}
