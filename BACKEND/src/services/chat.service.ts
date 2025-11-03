import { PrismaClient } from "@prisma/client"
import axios from "axios"
import FormData from "form-data"
import { getEnv } from "../config/env"
import { AppError } from "../middleware/errorHandler"
import { logger } from "../utils/logger"

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  log: ['error', 'warn'],
})

process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

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
      let n8nResponse

      if (imageUrl) {
        const form = new FormData()
        
        try {
          logger.info(`Descargando imagen desde: ${imageUrl}`)
          
          const imageResponse = await axios.get(imageUrl, { 
            responseType: 'stream',
            timeout: 15000
          })
          
          const contentType = imageResponse.headers['content-type'] || 'image/png'
          const extension = contentType.split('/')[1] || 'png'
          
          logger.info(`Imagen descargada, Content-Type: ${contentType}`)
          
          form.append('image', imageResponse.data, {
            filename: `image.${extension}`,
            contentType: contentType
          })
          form.append('userId', userId.toString())
          form.append('chatId', chatId.toString())
          form.append('clienteNombre', user.nombre)
          form.append('message', content)
          
          logger.info(`Enviando form-data a n8n. Esperando respuesta de Ollama...`)
          
          n8nResponse = await axios.post(env.N8N_WEBHOOK_URL, form, {
            headers: {
              ...form.getHeaders()
            },
            timeout: 900000,
            maxContentLength: Infinity,
            maxBodyLength: Infinity
          })
          
          logger.info(`Respuesta recibida de n8n exitosamente`)
        } catch (error) {
          if ((error as any).code === 'ECONNABORTED') {
            logger.error(`Timeout: Ollama tardó más de 15 minutos`)
            throw new AppError(500, "El análisis de imagen tardó demasiado. Intenta con una imagen más pequeña.")
          }
          logger.error(`Error procesando imagen: ${(error as any).message || error}`)
          throw new AppError(500, "Error procesando la imagen")
        }
      } else {
        logger.info(`Enviando mensaje de texto a n8n`)
        
        n8nResponse = await axios.post(env.N8N_WEBHOOK_URL, {
          message: content,
          userId,
          chatId,
          clienteNombre: user.nombre,
        }, {
          timeout: 300000,
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        logger.info(`Respuesta recibida de n8n`)
      }

      let responseData = n8nResponse.data
      
      logger.info(`Respuesta RAW de n8n: ${JSON.stringify(responseData).substring(0, 200)}...`)
      
      if (typeof responseData === 'string') {
        try {
          responseData = JSON.parse(responseData)
          logger.info('Respuesta parseada desde string a JSON')
        } catch (error) {
          logger.warn('No se pudo parsear respuesta como JSON, usando estructura por defecto')
          responseData = {
            tipo: 'simple',
            respuesta: responseData,
            contexto: 'Análisis de imagen'
          }
        }
      }
      
      const aiResponse = responseData.respuesta || responseData.imageAnalysis || responseData.message || "No se pudo procesar la solicitud"
      
      logger.info(`Respuesta IA extraída (${aiResponse.length} caracteres): ${aiResponse.substring(0, 100)}...`)

      if (responseData.ticket) {
        const ticket = responseData.ticket

        const aiMessage = await prisma.message.create({
          data: {
            chatId,
            content: aiResponse,
            sender: "ai",
          },
        })

        await prisma.chat.update({
          where: { id: chatId },
          data: {
            lastMessage: aiResponse,
            timestamp: new Date(),
          },
        })

        logger.info(`Consulta compleja detectada en chat ${chatId} → Ticket: ${ticket.ticketId}`)

        return {
          userMessage,
          aiMessage,
          requiresTicket: true,
          ticketSuggestion: {
            ticketNumber: ticket.ticketId,
            clientName: ticket.clienteNombre,
            clientEmail: user.email,
            subject: content.substring(0, 100),
            detail: content,
            imageUrl: ticket.imageUrl || null,
            chatId: chatId.toString(),
            userId: userId
          }
        }
      }

      const aiMessage = await prisma.message.create({
        data: {
          chatId,
          content: aiResponse,
          sender: "ai",
        },
      })

      await prisma.chat.update({
        where: { id: chatId },
        data: {
          lastMessage: aiResponse,
          timestamp: new Date(),
        },
      })

      logger.info(`Mensaje procesado exitosamente en chat ${chatId}`)
      
      return { userMessage, aiMessage }
    } catch (error) {
      logger.error(`Error en addMessage: ${(error as any).message || error}`)
      throw error instanceof AppError ? error : new AppError(500, "Error procesando mensaje")
    }
  },

  async confirmTicket(ticketId: string, userId: number) {
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

    const confirmedTicket = await prisma.ticket.update({
      where: { id: ticket.id },
      data: { 
        estado: 'confirmado',
        updatedAt: new Date()
      }
    })

    logger.info(`Ticket CONFIRMADO: ${ticketId} por usuario ${userId}`)
    return confirmedTicket
  },

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
