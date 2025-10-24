"use client"

import { useCallback, useState } from "react"
import { useAuth } from "../contexts/AuthContext"

export interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  imageUrl?: string
}

export interface Chat {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  messages: Message[]
}

interface ApiChat {
  id: number
  userId: number
  title: string
  lastMessage: string | null
  createdAt: string
  timestamp: string
  updatedAt: string
  messages?: ApiMessage[]
}

interface ApiMessage {
  id: number
  chatId: number
  content: string
  sender: "user" | "ai"
  imageUrl: string | null
  timestamp: string
}

export const useChats = () => {
  const { token } = useAuth()
  const [chats, setChats] = useState<Chat[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const loadChats = useCallback(async () => {
    if (!token) return

    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:3000/api/chats", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Error al cargar chats")
      }

      const data: ApiChat[] = await response.json()

      const chatsWithDates: Chat[] = data.map((chat: ApiChat) => ({
        id: chat.id.toString(),
        title: chat.title,
        lastMessage: chat.lastMessage || "",
        timestamp: new Date(chat.timestamp),
        messages:
          chat.messages?.map((msg: ApiMessage) => ({
            id: msg.id.toString(),
            content: msg.content,
            sender: msg.sender,
            timestamp: new Date(msg.timestamp),
            imageUrl: msg.imageUrl || undefined,
          })) || [],
      }))

      setChats(chatsWithDates)
    } catch (error) {
      console.error("Error loading chats:", error)
      setChats([])
    } finally {
      setIsLoading(false)
    }
  }, [token])

  const loadChatMessages = useCallback(
    async (chatId: string) => {
      if (!token) return

      try {
        const response = await fetch(`http://localhost:3000/api/chats/${chatId}/messages`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) throw new Error("Error al cargar mensajes")

        const messages: ApiMessage[] = await response.json()

        setChats((prev) =>
          prev.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: messages.map((msg: ApiMessage) => ({
                    id: msg.id.toString(),
                    content: msg.content,
                    sender: msg.sender,
                    timestamp: new Date(msg.timestamp),
                    imageUrl: msg.imageUrl || undefined,
                  })),
                }
              : chat,
          ),
        )
      } catch (error) {
        console.error("Error loading chat messages:", error)
      }
    },
    [token],
  )

  const createChat = useCallback(
    async (title: string) => {
      if (!token) {
        throw new Error("No hay token de autenticación")
      }

      try {
        const response = await fetch("http://localhost:3000/api/chats", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title }),
        })

        if (!response.ok) {
          throw new Error("Error al crear chat")
        }

        const newChat: ApiChat = await response.json()

        const chatWithDates: Chat = {
          id: newChat.id.toString(),
          title: newChat.title,
          lastMessage: newChat.lastMessage || "",
          timestamp: new Date(newChat.timestamp),
          messages: [],
        }

        setChats((prev) => [chatWithDates, ...prev])
        return chatWithDates
      } catch (error) {
        console.error("Error creating chat:", error)
        throw error
      }
    },
    [token],
  )

  const updateChatTitle = useCallback(
    async (chatId: string, newTitle: string) => {
      if (!token) {
        throw new Error("No hay token de autenticación")
      }

      try {
        const response = await fetch(`http://localhost:3000/api/chats/${chatId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: newTitle }),
        })

        if (!response.ok) {
          throw new Error("Error al actualizar título del chat")
        }

        setChats((prev) => prev.map((chat) => (chat.id === chatId ? { ...chat, title: newTitle } : chat)))
      } catch (error) {
        console.error("Error updating chat title:", error)
        throw error
      }
    },
    [token],
  )

  const sendMessage = useCallback(
    async (chatId: string, content: string, imageFile?: File) => {
      if (!token) throw new Error("No hay token de autenticación")

      try {
        let imageUrl: string | undefined

        if (imageFile) {
          const formData = new FormData()
          formData.append("image", imageFile)

          const uploadResponse = await fetch("http://localhost:3000/api/upload", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          })

          if (uploadResponse.ok) {
            const uploadData = await uploadResponse.json()
            imageUrl = uploadData.url
          }
        }

        const response = await fetch(`http://localhost:3000/api/chats/${chatId}/messages`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content, imageUrl }),
        })

        if (!response.ok) throw new Error("Error al enviar mensaje")

        const { userMessage, aiMessage } = await response.json()

        const currentChat = chats.find((chat) => chat.id === chatId)
        if (currentChat && currentChat.title === "Cargando...") {
          await updateChatTitle(chatId, content)
        }

        setChats((prev) =>
          prev.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  lastMessage: aiMessage.content,
                  timestamp: new Date(aiMessage.timestamp),
                  messages: [
                    ...chat.messages,
                    {
                      id: userMessage.id.toString(),
                      content: userMessage.content,
                      sender: userMessage.sender as "user" | "ai",
                      timestamp: new Date(userMessage.timestamp),
                      imageUrl: userMessage.imageUrl || undefined,
                    },
                    {
                      id: aiMessage.id.toString(),
                      content: aiMessage.content,
                      sender: aiMessage.sender as "user" | "ai",
                      timestamp: new Date(aiMessage.timestamp),
                    },
                  ],
                }
              : chat,
          ),
        )

        return { success: true }
      } catch (error) {
        console.error("Error sending message:", error)
        throw error
      }
    },
    [token, chats, updateChatTitle],
  )

  const deleteChat = useCallback(
    async (chatId: string) => {
      if (!token) {
        throw new Error("No hay token de autenticación")
      }

      try {
        const response = await fetch(`http://localhost:3000/api/chats/${chatId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Error al eliminar chat")
        }

        setChats((prev) => prev.filter((chat) => chat.id !== chatId))
      } catch (error) {
        console.error("Error deleting chat:", error)
        throw error
      }
    },
    [token],
  )

  return {
    chats,
    isLoading,
    loadChats,
    loadChatMessages,
    createChat,
    sendMessage,
    deleteChat,
    setChats,
    updateChatTitle,
  }
}
