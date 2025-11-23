"use client"



import type React from "react"
import { useEffect, useRef, useState } from "react"



import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, CheckCircle2, ImageIcon, LogOut, Plus, Send, Settings, Ticket, Trash2, User, X } from "lucide-react"



import { useAuth } from "../contexts/AuthContext"
import { useChats, type TicketSuggestion } from "../hooks/useChats"



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
    confirmTicket,
    cancelTicket,
    deleteChat,
  } = useChats()



  const [currentInput, setCurrentInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeChat, setActiveChat] = useState<string>("")
  const [selectedImage, setSelectedImage] = useState<{ file: File; url: string } | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [hoveredChat, setHoveredChat] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)



  const [showTicketDialog, setShowTicketDialog] = useState(false)
  const [pendingTicket, setPendingTicket] = useState<TicketSuggestion | null>(null)
  const [isCreatingTicket, setIsCreatingTicket] = useState(false)
  const [chatsLoaded, setChatsLoaded] = useState(false)



  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editedName, setEditedName] = useState(user?.nombre || "")
  const [editedEmail, setEditedEmail] = useState(user?.email || "")
  const [editedPassword, setEditedPassword] = useState("")



  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [showTicketSuccessDialog, setShowTicketSuccessDialog] = useState(false)
  const [createdTicketNumber, setCreatedTicketNumber] = useState("")



  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])



  useEffect(() => {
    if (!chatsLoaded && !chatsLoading && token) {
      loadChats().then(() => setChatsLoaded(true)).catch(() => setChatsLoaded(true))
    }
  }, [chatsLoaded, chatsLoading, token, loadChats])



  useEffect(() => {
    if (activeChat && token) loadChatMessages(activeChat)
  }, [activeChat, token, loadChatMessages])



  useEffect(() => {
    setEditedName(user?.nombre || "")
    setEditedEmail(user?.email || "")
  }, [user])



  const currentChat = chats.find((chat) => chat.id === activeChat)



  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      alert("Solo JPEG o PNG")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Máximo 5MB")
      return
    }
    setSelectedImage({ file, url: URL.createObjectURL(file) })
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
    const content = currentInput || (selectedImage ? "Analiza esta imagen." : "")
    const temp = content
    const tempImg = selectedImage?.file
    setCurrentInput("")
    clearSelectedImage()
    try {
      const res = await sendMessage(activeChat, temp, tempImg)
      if (res.requiresTicket && res.ticketSuggestion) {
        setPendingTicket(res.ticketSuggestion)
        setShowTicketDialog(true)
      }
    } catch {
      alert("Error al enviar mensaje")
      setCurrentInput(temp)
    } finally {
      setIsLoading(false)
    }
  }



  const handleConfirmTicket = async () => {
    if (!pendingTicket) return
    setIsCreatingTicket(true)
    try {
      await confirmTicket(pendingTicket.ticketNumber)
      setCreatedTicketNumber(pendingTicket.ticketNumber)
      setShowTicketDialog(false)
      setPendingTicket(null)
      setShowTicketSuccessDialog(true)
    } catch {
      alert("Error al crear ticket")
    } finally {
      setIsCreatingTicket(false)
    }
  }



  const handleCancelTicket = async () => {
    if (!pendingTicket) {
      setShowTicketDialog(false)
      return
    }
    try {
      await cancelTicket(pendingTicket.ticketNumber)
    } catch (err) {
      console.error(err)
    }
    setShowTicketDialog(false)
    setPendingTicket(null)
  }



  const createNewChat = async () => {
    try {
      const nc = await createChat("Cargando...")
      setActiveChat(nc.id)
    } catch {
      alert("Error al crear chat")
    }
  }



  const handleDeleteChat = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm("¿Eliminar chat?")) return
    try {
      await deleteChat(id)
      if (activeChat === id) setActiveChat("")
    } catch {
      alert("Error al eliminar")
    }
  }



  const formatTime = (d: Date) => d.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })
  const formatDateTime = (d: Date) => d.toLocaleString("es-PE", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "America/Lima", hour12: false })



  return (
    <div className="h-screen flex bg-gradient-background">
      <AlertDialog open={showTicketDialog} onOpenChange={setShowTicketDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5 text-primary" />
              ¿Crear ticket?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3 pt-2">
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between"><span className="text-sm font-medium">Ticket:</span><span className="text-sm font-bold text-primary">{pendingTicket?.ticketNumber}</span></div>
                <div className="flex justify-between"><span className="text-sm font-medium">Cliente:</span><span className="text-sm">{pendingTicket?.clientName}</span></div>
                <div className="border-t pt-2 mt-2"><span className="text-sm font-medium block mb-1">Asunto:</span><span className="text-sm text-muted-foreground line-clamp-3">{pendingTicket?.subject}</span></div>
              </div>
              <span className="text-sm text-center block">Se notificará por WhatsApp</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelTicket} disabled={isCreatingTicket}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmTicket} disabled={isCreatingTicket} className="bg-primary hover:bg-primary/90">
              {isCreatingTicket ? "Creando..." : "Aceptar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>



      <AlertDialog open={showTicketSuccessDialog} onOpenChange={setShowTicketSuccessDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Ticket creado exitosamente
            </AlertDialogTitle>
            <AlertDialogDescription>
              El ticket <span className="font-bold text-primary">{createdTicketNumber}</span> ha sido creado correctamente y se ha enviado la notificación por WhatsApp.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={() => setShowTicketSuccessDialog(false)}
              className="bg-primary hover:bg-primary/90"
            >
              Aceptar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>



      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <LogOut className="h-5 w-5 text-primary" />
              ¿Cerrar sesión?
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro que deseas cerrar sesión?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowLogoutDialog(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                setShowLogoutDialog(false)
                onLogout()
              }}
              className="bg-primary hover:bg-primary/90"
            >
              Sí, cerrar sesión
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>



      <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar perfil</DialogTitle>
            <DialogDescription>
              Actualiza tu información personal
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="Tu nombre"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                value={editedEmail}
                onChange={(e) => setEditedEmail(e.target.value)}
                placeholder="tu@ejemplo.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Nueva contraseña (opcional)</Label>
              <Input
                id="password"
                type="password"
                value={editedPassword}
                onChange={(e) => setEditedPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                alert("¡Cambios guardados! (próximamente conectado al backend)")
                setIsEditingProfile(false)
                setEditedPassword("")
              }}
              className="bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Guardar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>



      <div className="w-80 border-r border-border/50 flex flex-col bg-card/30 backdrop-blur-sm">
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gradient">Chat IA</h2>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="ghost" onClick={createNewChat}><Plus className="h-4 w-4" /></Button>
              <Button size="sm" variant="ghost" onClick={() => setIsEditingProfile(true)}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button onClick={createNewChat} className="w-full bg-gradient-primary hover:opacity-90 text-white">
            <Plus className="h-4 w-4 mr-2" /> Nueva Consulta
          </Button>
        </div>



        <ScrollArea className="flex-1">
          <div className="px-4 py-4 space-y-4">
            {chats.map((chat) => {
              const lastUserMsg = chat.messages.length > 0
                ? chat.messages.slice().reverse().find(m => m.sender === "user")?.content
                : null
              const previewText = lastUserMsg || chat.title



              return (
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
                  <CardContent className="p-4 flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">{previewText}</p>
                    </div>



                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatTime(chat.timestamp)}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 hover:bg-destructive hover:text-destructive-foreground"
                        style={{ opacity: hoveredChat === chat.id ? 1 : 0, pointerEvents: hoveredChat === chat.id ? "auto" : "none" }}
                        onClick={(e) => handleDeleteChat(chat.id, e)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </ScrollArea>



        <div className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
          <div className="flex items-center h-20 px-6 justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-14 w-14 ring-2 ring-purple-500/20">
                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold text-xl">
                  {user?.nombre.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-base font-semibold text-foreground">{user?.nombre || "Usuario"}</p>
                <p className="text-sm text-muted-foreground">En línea</p>
              </div>
            </div>
            <Button size="icon" variant="ghost" onClick={() => setShowLogoutDialog(true)} className="h-10 w-10">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>



      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-border/50 bg-card/30 backdrop-blur-sm flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-accent text-accent-foreground"><Bot className="h-4 w-4" /></AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{currentChat?.title || "Bienvenido"}</h3>
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
            {currentChat?.messages.map((msg) => (
              <div key={msg.id} className={`flex items-start space-x-3 animate-fade-in-up ${msg.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className={msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}>
                    {msg.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                <div className={`max-w-[70%] ${msg.sender === "user" ? "text-right" : ""}`}>
                  <Card className={msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted/50"}>
                    <CardContent className="p-3">
                      {msg.imageUrl && <img src={msg.imageUrl} alt="Imagen subida" className="max-w-[150px] max-h-[150px] rounded-md mb-2 object-cover" />}
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </CardContent>
                  </Card>
                  <span className="text-xs text-muted-foreground mt-1 block">{formatTime(msg.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>



        <div className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
          <div className="flex items-center h-20 px-6 gap-4">
            <div className="flex-1 flex items-end space-x-3">
              <Input
                placeholder="Escribe tu mensaje..."
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendUserMessage()}
                disabled={isLoading}
                className="min-h-14 text-base placeholder:text-muted-foreground/70 resize-none border-border/50 focus-visible:ring-purple-500/30"
                aria-label="Mensaje"
              />



              <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => fileInputRef.current?.click()} 
                disabled={isLoading}
                className="h-12 w-12 rounded-xl hover:bg-accent/80"
                aria-label="Adjuntar imagen"
              >
                <ImageIcon className="h-6 w-6" />
              </Button>



              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                aria-label="Subir imagen"
                onChange={handleImageUpload}
              />



              <Button 
                onClick={sendUserMessage} 
                disabled={isLoading || (!currentInput.trim() && !selectedImage)}
                className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg transition-all"
                aria-label="Enviar mensaje"
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>



          {selectedImage && (
            <div className="px-6 pb-3 flex items-center space-x-3">
              <img 
                src={selectedImage.url} 
                alt="Vista previa" 
                className="max-w-[100px] max-h-[100px] rounded-lg object-cover shadow-md" 
              />
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={clearSelectedImage} 
                className="text-red-500 hover:bg-red-500/20 h-9 w-9"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}



export default ChatInterface
