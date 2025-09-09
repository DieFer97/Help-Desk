import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import {
  Bot,
  LogOut,
  Plus,
  Send,
  Settings,
  User
} from "lucide-react";
import { useState } from "react";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
}

interface ChatInterfaceProps {
  onLogout: () => void;
}

const ChatInterface = ({ onLogout }: ChatInterfaceProps) => {
  const [currentInput, setCurrentInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeChat, setActiveChat] = useState<string>("1");
  
  const [chats, setChats] = useState<Chat[]>([
    {
      id: "1",
      title: "Consulta sobre facturación",
      lastMessage: "¿Cómo puedo cambiar mi método de pago?",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      messages: [
        {
          id: "1",
          content: "¿Cómo puedo cambiar mi método de pago?",
          sender: "user",
          timestamp: new Date(Date.now() - 1000 * 60 * 30)
        },
        {
          id: "2",
          content: "Te ayudo con el cambio de método de pago. Puedes acceder a Configuración > Facturación y seleccionar 'Cambiar método de pago'. ¿Necesitas ayuda con algún paso específico?",
          sender: "ai",
          timestamp: new Date(Date.now() - 1000 * 60 * 29)
        }
      ]
    },
    {
      id: "2",
      title: "Integración API",
      lastMessage: "Explícame los endpoints disponibles",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      messages: []
    }
  ]);

  const currentChat = chats.find(chat => chat.id === activeChat);

  const sendMessage = async () => {
    if (!currentInput.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: currentInput,
      sender: 'user',
      timestamp: new Date()
    };

    setChats(prev => prev.map(chat => 
      chat.id === activeChat 
        ? { ...chat, messages: [...chat.messages, userMessage] }
        : chat
    ));

    setCurrentInput("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/api/chat", {
        message: userMessage.content
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.data.respuesta,
        sender: 'ai',
        timestamp: new Date()
      };

      setChats(prev => prev.map(chat => 
        chat.id === activeChat 
          ? { ...chat, messages: [...chat.messages, aiMessage] }
          : chat
      ));
    } catch (err) {
      console.error(err);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: "No pude generar una respuesta en este momento.",
        sender: 'ai',
        timestamp: new Date()
      };

      setChats(prev => prev.map(chat => 
        chat.id === activeChat 
          ? { ...chat, messages: [...chat.messages, errorMessage] }
          : chat
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "Nueva consulta",
      lastMessage: "",
      timestamp: new Date(),
      messages: []
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChat(newChat.id);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="h-screen flex bg-gradient-background">
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
          <Button 
            onClick={createNewChat}
            className="w-full bg-gradient-primary hover:opacity-90 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Consulta
          </Button>
        </div>

        <ScrollArea className="flex-1 px-4">
          <div className="space-y-2 py-4">
            {chats.map((chat) => (
              <Card 
                key={chat.id}
                className={`cursor-pointer transition-all hover:bg-muted/50 ${
                  activeChat === chat.id ? 'border-primary/50 bg-primary/5' : 'border-border/30'
                }`}
                onClick={() => setActiveChat(chat.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate text-sm">
                        {chat.title}
                      </h3>
                      {chat.lastMessage && (
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {chat.lastMessage}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end ml-2">
                      <span className="text-xs text-muted-foreground">
                        {formatTime(chat.timestamp)}
                      </span>
                    </div>
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
                <AvatarFallback className="bg-primary text-primary-foreground">U</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Usuario</p>
                <p className="text-xs text-muted-foreground">En línea</p>
              </div>
            </div>
            <Button size="sm" variant="ghost" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-border/50 bg-card/30 backdrop-blur-sm">
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
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {currentChat?.messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 animate-fade-in-up ${
                  message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className={
                    message.sender === 'user' 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-accent text-accent-foreground"
                  }>
                    {message.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                <div className={`max-w-[70%] ${message.sender === 'user' ? 'text-right' : ''}`}>
                  <Card className={`${
                    message.sender === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted/50'
                  }`}>
                    <CardContent className="p-3">
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </CardContent>
                  </Card>
                  <span className="text-xs text-muted-foreground mt-1 block">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border/50 flex items-center space-x-2">
          <Input
            placeholder="Escribe tu mensaje..."
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <Button onClick={sendMessage} disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
