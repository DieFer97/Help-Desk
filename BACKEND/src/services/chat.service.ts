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
      orderBy: { timestamp: "desc" },
      include: {
        messages: {
          take: 10,
          orderBy: { timestamp: "asc" },
        },
      },
    })
    return chats
  },

  async getChat(chatId: number, userId: number) {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: { messages: { orderBy: { timestamp: "asc" } } },
    })

    if (!chat || chat.userId !== userId) {
      throw new AppError(404, "Chat no encontrado")
    }

    return chat
  },

  async getMessagesByChatId(chatId: number, userId: number) {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      select: { userId: true },
    })

    if (!chat || chat.userId !== userId) {
      throw new AppError(404, "Chat no encontrado o sin acceso")
    }

    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { timestamp: "asc" },
    })

    return messages
  },

  async addMessage(chatId: number, userId: number, content: string, imageUrl?: string) {
    const chat = await prisma.chat.findUnique({ where: { id: chatId } })
    if (!chat || chat.userId !== userId) {
      throw new AppError(404, "Chat no encontrado")
    }

    const userMessage = await prisma.message.create({
      data: {
        chatId,
        content,
        sender: "user",
        imageUrl,
      },
    })

    try {
      const response = await axios.post(env.N8N_WEBHOOK_URL, {
        message: content,
        imageUrl,
        userId,
        chatId,
        clienteNombre: chat.title,
      })

      const aiMessage = await prisma.message.create({
        data: {
          chatId,
          content: response.data.respuesta || "No se pudo procesar la solicitud",
          sender: "ai",
        },
      })

      await prisma.chat.update({
        where: { id: chatId },
        data: {
          lastMessage: aiMessage.content,
          timestamp: new Date(),
        },
      })

      logger.info(`Mensaje procesado en chat ${chatId}`)
      return { userMessage, aiMessage }
    } catch (error) {
      logger.error(`Error llamando N8n webhook: ${error}`)
      throw new AppError(500, "Error procesando mensaje")
    }
  },

  async updateChatTitle(chatId: number, userId: number, title: string) {
    const chat = await prisma.chat.findUnique({ where: { id: chatId } })
    if (!chat || chat.userId !== userId) {
      throw new AppError(404, "Chat no encontrado")
    }

    const updatedChat = await prisma.chat.update({
      where: { id: chatId },
      data: { title },
    })

    logger.info(`Título del chat ${chatId} actualizado a: ${title}`)
    return updatedChat
  },

  async deleteChat(chatId: number, userId: number) {
    const chat = await prisma.chat.findUnique({ where: { id: chatId } })
    if (!chat || chat.userId !== userId) {
      throw new AppError(404, "Chat no encontrado")
    }

    await prisma.chat.delete({ where: { id: chatId } })
    logger.info(`Chat eliminado: ${chatId}`)
    return { success: true }
  },
}
