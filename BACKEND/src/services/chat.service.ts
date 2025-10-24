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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { nombre: true, email: true },
    })

    if (!user) {
      throw new AppError(404, "Usuario no encontrado")
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
        clienteNombre: user.nombre,
      })

      const responseData = response.data

      // ✅ NUEVO: Verificar si N8N retornó un ticket (consulta compleja)
      if (responseData.ticket) {
        // N8N creó un ticket automáticamente, necesitamos interceptarlo
        const ticket = responseData.ticket
        
        // Guardamos el mensaje de la IA
        const aiMessage = await prisma.message.create({
          data: {
            chatId,
            content: responseData.respuesta || "Gracias por tu consulta. Un agente te contactará pronto.",
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

        logger.info(`Consulta compleja detectada en chat ${chatId}`)
        
        // ✅ RETORNAR: Con sugerencia de ticket para que el frontend muestre el diálogo
        return { 
          userMessage, 
          aiMessage,
          requiresTicket: true,
          ticketSuggestion: {
          ticketNumber: ticket.ticketId,
          clientName: ticket.clienteNombre,
          clientEmail: user.email,
          subject: content.substring(0, 100),  // ✅ Usar el mensaje del usuario
          detail: content,  // ✅ Mensaje completo
          imageUrl: ticket.imageUrl || null,
          chatId: chatId.toString(),
          userId: userId
        }
        }
      }

      // ✅ Si no hay ticket, es una consulta simple
      const aiMessage = await prisma.message.create({
        data: {
          chatId,
          content: responseData.respuesta || "No se pudo procesar la solicitud",
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

  // ✅ NUEVO: Confirmar ticket (elimina el pendiente y crea uno nuevo confirmado)
  async confirmTicket(ticketId: string, userId: number) {
    // Verificar que el ticket existe y pertenece al usuario
    const ticket = await prisma.ticket.findFirst({
      where: {
        ticketId: ticketId,
        userId: userId,
        estado: 'pendiente'
      }
    })

    if (!ticket) {
      throw new AppError(404, "Ticket no encontrado o ya fue procesado")
    }

    // Actualizar el estado del ticket a confirmado
    const confirmedTicket = await prisma.ticket.update({
      where: { id: ticket.id },
      data: { 
        estado: 'pendiente',
        updatedAt: new Date()
      }
    })

    logger.info(`Ticket confirmado: ${ticketId} por usuario ${userId}`)
    return confirmedTicket
  },

  // ✅ NUEVO: Cancelar ticket (eliminar el ticket temporal)
  async cancelTicket(ticketId: string, userId: number) {
    const ticket = await prisma.ticket.findFirst({
      where: {
        ticketId: ticketId,
        userId: userId,
        estado: 'pendiente'
      }
    })

    if (!ticket) {
      throw new AppError(404, "Ticket no encontrado")
    }

    await prisma.ticket.delete({
      where: { id: ticket.id }
    })

    logger.info(`Ticket cancelado: ${ticketId} por usuario ${userId}`)
    return { success: true }
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