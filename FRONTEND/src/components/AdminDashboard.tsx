import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertTriangle,
  Bell,
  Check,
  CheckCircle,
  Clock,
  Filter,
  LogOut,
  MessageSquare,
  Settings,
  Shield,
  Trash2,
  TrendingUp,
  Users
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

// === TIPOS PERSONALIZADOS ===
interface Ticket {
  id: number;
  ticketId: string;
  clienteNombre: string;
  userId: number;
  user?: { nombre: string; email: string };
  asunto: string;
  detalle: string;
  imagenUrl?: string | null;
  estado: string;
  prioridad: string;
  createdAt: string;
  updatedAt: string;
}

interface WeeklyData {
  name: string;
  consultas: number;
  tickets: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeChats: 0,
    criticalTickets: 0,
    resolvedToday: 0,
    totalTickets: 0,
  });

  const [chartData, setChartData] = useState<{
    weekly: WeeklyData[];
    categories: CategoryData[];
  }>({ weekly: [], categories: [] });

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token") || ""
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        }
        if (token) {
          headers.Authorization = `Bearer ${token}`
        }

        const [ticketsRes, statsRes] = await Promise.all([
          fetch("/api/tickets", { headers }),
          fetch("/api/tickets/stats", { headers }),
        ])

        if (!ticketsRes.ok || !statsRes.ok) {
          const errText = await ticketsRes.text().catch(() => "Error")
          throw new Error(`HTTP ${ticketsRes.status}: ${errText}`)
        }

        const ticketsData: Ticket[] = await ticketsRes.json()
        const stats = await statsRes.json()

        setTickets(ticketsData)

        setStats({
          totalUsers: stats.totalUsers || 0,
          activeChats: stats.totalChats || 0,
          criticalTickets: stats.criticalTickets || 0,
          resolvedToday: stats.resolvedToday || 0,
          totalTickets: stats.totalTickets || 0,
        })

        const weeklyData: WeeklyData[] = (stats.weeklyTickets || []).map((d: { name: string; tickets: number }) => ({
          ...d,
          consultas: 40 + Math.floor(Math.random() * 60),
        }))

        setChartData({
          weekly: weeklyData,
          categories: stats.categories || [],
        })
      } catch (err) {
        console.error("Error cargando dashboard:", err)
        setStats({ totalUsers: 0, activeChats: 0, criticalTickets: 0, resolvedToday: 0, totalTickets: 0 })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleUpdateTicket = async (id: number, estado: string) => {
    try {
      const token = localStorage.getItem("token") || ""
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      const res = await fetch(`/api/tickets/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ estado }),
      })

      if (!res.ok) throw new Error("Error actualizando ticket")

      setTickets(tickets.map(t => t.id === id ? { ...t, estado } : t))
      setSelectedTicket(null)
    } catch (err) {
      console.error("Error:", err)
      alert("No se pudo actualizar el ticket")
    }
  }

  const handleDeleteTicket = async (id: number) => {
    if (!confirm("¿Seguro que quieres eliminar este ticket?")) return

    try {
      const token = localStorage.getItem("token") || ""
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      const res = await fetch(`/api/tickets/${id}`, {
        method: "DELETE",
        headers,
      })

      if (!res.ok) throw new Error("Error eliminando ticket")

      // Actualizar lista local
      setTickets(tickets.filter(t => t.id !== id))
      setSelectedTicket(null)
    } catch (err) {
      console.error("Error:", err)
      alert("No se pudo eliminar el ticket")
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-destructive text-destructive-foreground';
      case 'high': return 'bg-warning text-warning-foreground';
      case 'medium': return 'bg-accent text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'in-progress': return 'bg-warning/10 text-warning border-warning/20';
      case 'resolved': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-background">
      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Ticket {selectedTicket?.ticketId}
              <DialogClose>
              </DialogClose>
            </DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Cliente:</p>
                <p className="text-sm">{selectedTicket.user?.nombre || selectedTicket.clienteNombre}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Email:</p>
                <p className="text-sm">{selectedTicket.user?.email || "No disponible"}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Asunto:</p>
                <p className="text-sm">{selectedTicket.asunto}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Detalle:</p>
                <p className="text-sm">{selectedTicket.detalle}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Prioridad:</p>
                <Badge className={getPriorityColor(selectedTicket.prioridad === "crítica" ? "critical" : "high")}>
                  {selectedTicket.prioridad}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium">Estado:</p>
                <Badge className={getStatusColor(selectedTicket.estado === "pendiente" ? "open" : "in-progress")}>
                  {selectedTicket.estado}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium">Creado:</p>
                <p className="text-sm">{new Date(selectedTicket.createdAt).toLocaleString("es-ES")}</p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="ghost" size="icon" onClick={() => handleUpdateTicket(selectedTicket.id, "resuelto")}>
                  <Check className="h-4 w-4 text-success" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteTicket(selectedTicket.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <header className="sticky top-0 z-10 border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary p-1.5">
                <Shield className="w-full h-full text-white" />
              </div>
              <h1 className="text-xl font-bold text-gradient">Dashboard Admin</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  A
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">Admin</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {loading ? (
            <div className="flex-1 flex items-center justify-center h-96">
              <div className="text-muted-foreground">Cargando datos del dashboard...</div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="glass-effect border-border/50">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
                    <Users className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-success">+12%</span> desde el mes pasado
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-border/50">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Chats Activos</CardTitle>
                    <MessageSquare className="h-4 w-4 text-accent" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.activeChats}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-success">+5%</span> vs ayer
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-border/50">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tickets Generados</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-warning" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-warning">{stats.totalTickets}</div>
                    <p className="text-xs text-muted-foreground">
                      Requieren atención inmediata
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-border/50">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Resueltos Hoy</CardTitle>
                    <CheckCircle className="h-4 w-4 text-success" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-success">{stats.resolvedToday}</div>
                    <p className="text-xs text-muted-foreground">
                      Meta: 50 tickets
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 glass-effect border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Actividad Semanal</span>
                    </CardTitle>
                    <CardDescription>Consultas y tickets por día</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData.weekly}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }} 
                        />
                        <Bar dataKey="consultas" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="tickets" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-warning" />
                        <span>Tickets</span>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-80">
                      <div className="space-y-4">
                        {tickets.slice(0, 5).map((ticket) => (
                          <div key={ticket.id} className="border border-border/50 rounded-lg p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className={getStatusColor(
                                ticket.estado === "pendiente" ? "open" :
                                ticket.estado === "en_proceso" ? "in-progress" : "resolved"
                              )}>
                                {ticket.estado}
                              </Badge>
                              <Badge variant="outline" className={getPriorityColor(
                                ticket.prioridad === "crítica" ? "critical" :
                                ticket.prioridad === "alta" ? "high" : "medium"
                              )}>
                                {ticket.prioridad}
                              </Badge>
                            </div>
                            <h4 className="font-medium text-sm">{ticket.asunto}</h4>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{ticket.user?.nombre || ticket.clienteNombre}</span>
                              <div className="flex items-center space-x-2">
                                <Clock className="h-3 w-3" />
                                <span>{new Date(ticket.createdAt).toLocaleTimeString("es-ES", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}</span>
                              </div>
                            </div>
                            <Button size="sm" variant="outline" className="w-full" onClick={() => setSelectedTicket(ticket)}>
                              Ver Ticket
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              <Card className="glass-effect border-border/50">
                <CardHeader>
                  <CardTitle>Distribución por Categorías</CardTitle>
                  <CardDescription>Tipos de consultas más frecuentes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={chartData.categories}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {chartData.categories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;