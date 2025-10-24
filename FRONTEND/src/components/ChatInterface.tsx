"use client"

import type React from "react"
import { useEffect } from "react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, ImageIcon, LogOut, Plus, Send, Settings, Trash2, User, X } from "lucide-react"
import { useRef, useState } from "react"

import { useAuth } from "../contexts/AuthContext"
import { useChats } from "../hooks/useChats"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  imageUrl?: string
}

interface Chat {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  messages: Message[]
}

interface ChatInterfaceProps {
  onLogout: () => void
}

const ChatInterface = ({ onLogout }: ChatInterfaceProps) => {
  const { user, token } = useAuth()
  const {
    chats,
    isLoading: chatsLoading,
    loadChats,
    loadChatMessages,
    createChat,
    sendMessage,
    deleteChat,
    setChats,
  } = useChats()
  const [currentInput, setCurrentInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeChat, setActiveChat] = useState<string>("")
  const [selectedImage, setSelectedImage] = useState<{ file: File; url: string } | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [hoveredChat, setHoveredChat] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    loadChats()
  }, [loadChats])

  useEffect(() => {
    if (activeChat && token) {
      loadChatMessages(activeChat)
    }
  }, [activeChat, token, loadChatMessages])

  const currentChat = chats.find((chat) => chat.id === activeChat)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      alert("Solo se permiten imágenes JPEG o PNG")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen debe ser menor a 5MB")
      return
    }

    const imageUrl = URL.createObjectURL(file)
    setSelectedImage({ file, url: imageUrl })

    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const clearSelectedImage = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage.url)
      setSelectedImage(null)
    }
  }

  const sendUserMessage = async () => {
    if ((!currentInput.trim() && !selectedImage) || isLoading || !activeChat) return

    setIsLoading(true)
    const messageContent = currentInput || (selectedImage ? "Analiza esta imagen." : "")

    const tempInput = messageContent
    const tempImage = selectedImage?.file

    setCurrentInput("")
    clearSelectedImage()

    try {
      await sendMessage(activeChat, tempInput, tempImage)
    } catch (err) {
      console.error("Error al enviar mensaje:", err)
      alert("No se pudo enviar el mensaje. Intenta de nuevo.")
      setCurrentInput(tempInput)
    } finally {
      setIsLoading(false)
    }
  }

  const createNewChat = async () => {
    try {
      const newChat = await createChat("Cargando...")
      setActiveChat(newChat.id)
    } catch (error) {
      console.error("Error al crear chat:", error)
      alert("No se pudo crear el chat. Intenta de nuevo.")
    }
  }

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()

    if (!confirm("¿Estás seguro de eliminar este chat?")) return

    try {
      await deleteChat(chatId)
      if (activeChat === chatId) {
        setActiveChat("")
      }
    } catch (error) {
      console.error("Error al eliminar chat:", error)
      alert("No se pudo eliminar el chat. Intenta de nuevo.")
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDateTime = (date: Date) => {
    return date.toLocaleString("es-PE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "America/Lima",
      hour12: false,
    })
  }

  return (
    <div className="h-screen flex bg-gradient-background">
      {/* SIDEBAR */}
      <div className="w-80 border-r border-border/50 flex flex-col bg-card/30 backdrop-blur-sm">
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gradient">Chat IA</h2>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="ghost" onClick={createNewChat}>
                <Plus className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button onClick={createNewChat} className="w-full bg-gradient-primary hover:opacity-90 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Consulta
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="px-4 py-4 space-y-4">
            {chats.map((chat) => (
              <Card
                key={chat.id}
                className={`cursor-pointer transition-all hover:shadow-lg border-2 max-w-[18rem] ${
                  activeChat === chat.id
                    ? "border-primary bg-primary/15 shadow-md"
                    : "border-border/40 bg-card/50 hover:bg-card/70 hover:border-border/60"
                }`}
                onClick={() => setActiveChat(chat.id)}
                onMouseEnter={() => setHoveredChat(chat.id)}
                onMouseLeave={() => setHoveredChat("")}
              >
                <CardContent className="p-4 flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-foreground truncate">{chat.title}</h3>
                    <p className="text-xs text-muted-foreground truncate mt-2 line-clamp-2">{chat.lastMessage}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-muted-foreground whitespace-nowrap font-medium">
                      {formatTime(chat.timestamp)}
                    </span>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 transition-all hover:bg-destructive hover:text-destructive-foreground"
                      style={{
                        opacity: hoveredChat === chat.id ? 1 : 0,
                        pointerEvents: hoveredChat === chat.id ? "auto" : "none",
                      }}
                      onClick={(e) => handleDeleteChat(chat.id, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.nombre.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{user?.nombre || "Usuario"}</p>
                <p className="text-xs text-muted-foreground">En línea</p>
              </div>
            </div>
            <Button size="sm" variant="ghost" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-border/50 bg-card/30 backdrop-blur-sm flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-accent text-accent-foreground">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{currentChat?.title || "Selecciona un chat"}</h3>
              <p className="text-sm text-muted-foreground">Asistente IA • Siempre disponible</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium capitalize">{formatDateTime(currentTime)}</p>
            <p className="text-xs text-muted-foreground">Huánuco, Perú</p>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {currentChat?.messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 animate-fade-in-up ${
                  message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback
                    className={
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent text-accent-foreground"
                    }
                  >
                    {message.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                <div className={`max-w-[70%] ${message.sender === "user" ? "text-right" : ""}`}>
                  <Card className={message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted/50"}>
                    <CardContent className="p-3">
                      {message.imageUrl && (
                        <img
                          src={message.imageUrl || "/placeholder.svg"}
                          alt="Imagen subida"
                          className="max-w-[150px] max-h-[150px] rounded-md mb-2 object-cover"
                        />
                      )}
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </CardContent>
                  </Card>
                  <span className="text-xs text-muted-foreground mt-1 block">{formatTime(message.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border/50 flex flex-col space-y-2">
          {selectedImage && (
            <div className="flex items-center space-x-2">
              <img
                src={selectedImage.url || "/placeholder.svg"}
                alt="Vista previa de la imagen"
                className="max-w-[100px] max-h-[100px] rounded-md object-cover"
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={clearSelectedImage}
                className="text-red-500 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Escribe tu mensaje..."
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendUserMessage()}
              disabled={isLoading}
            />
            <Button size="icon" variant="ghost" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
              <ImageIcon className="h-4 w-4" />
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              aria-label="Subir imagen"
              onChange={handleImageUpload}
            />
            <Button onClick={sendUserMessage} disabled={isLoading || (!currentInput.trim() && !selectedImage)}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface
