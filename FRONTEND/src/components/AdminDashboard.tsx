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

interface RecentQuery {
  id: number;
  content: string;
  timestamp: string;
  userName: string;
  userEmail: string;
  chatId: number;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

interface AdminUser {
  id: number;
  nombre: string;
  email: string;
  rol: "admin" | "cliente";
  creadoEl: string;
}

interface PendingUser {
  id: number;
  nombre: string;
  email: string;
  rol: "admin" | "cliente";
  creadoEl: string;
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
  const [recentQueries, setRecentQueries] = useState<RecentQuery[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [hoveredQuery, setHoveredQuery] = useState<number | null>(null);

  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);

  const [admins, setAdmins] = useState<AdminUser[]>([
  {
    id: 6,
    nombre: "Ricardo Kaká",
    email: "riki10@gmail.com",
    rol: "admin",
    creadoEl: "2025-10-26T19:50:46.249Z",
  },
  {
    id: 2,
    nombre: "Juan Perez",
    email: "juan.perez@example.com",
    rol: "admin",
    creadoEl: "2025-10-20T21:47:57.258Z",
  },
  {
    id: 3,
    nombre: "Diego De Almagro",
    email: "diefer97gmail.com",
    rol: "admin",
    creadoEl: "2025-10-21T23:20:21.285Z",
  },
  {
    id: 4,
    nombre: "Luca Toni",
    email: "luca@toni.com",
    rol: "admin",
    creadoEl: "2025-10-24T18:26:16.260Z",
  },
  {
    id: 5,
    nombre: "Mike Ortiz",
    email: "portero@gmail.com",
    rol: "admin",
    creadoEl: "2025-10-26T19:56:40.249Z",
  },
  {
    id: 7,
    nombre: "Paul Elstak",
    email: "goat1@gmail.com",
    rol: "admin",
    creadoEl: "2025-10-30T21:40:16.128Z",
  },
]);

  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([
  {
    id: 8,
    nombre: "Cristiano Ronaldo",
    email: "cr7@gmail.com",
    rol: "cliente",
    creadoEl: "2025-11-02T20:49:33.215Z",
  },
  {
    id: 9,
    nombre: "Sosimo Sacramento",
    email: "sosimo32@gmail.com",
    rol: "cliente",
    creadoEl: "2025-11-03T21:39:24.215Z",
  },
  {
    id: 10,
    nombre: "Martin Garrix",
    email: "martin1@gmail.com",
    rol: "cliente",
    creadoEl: "2025-11-04T13:02:31.093Z",
  },
  {
    id: 11,
    nombre: "Hugo Garcia",
    email: "hugito7@gmail.com",
    rol: "cliente",
    creadoEl: "2025-11-11T20:27:26.267Z",
  },
  {
    id: 12,
    nombre: "Piere Papin",
    email: "piere9@hotmail.com",
    rol: "cliente",
    creadoEl: "2025-11-14T20:08:58.545Z",
  },
  {
    id: 1,
    nombre: "Marco Van Basten",
    email: "goleador9@gmail.com",
    rol: "cliente",
    creadoEl: "2025-10-19T10:00:00.000Z",
  },
]);

  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [pendingModalOpen, setPendingModalOpen] = useState(false);

  const [adminSearch, setAdminSearch] = useState("");
  const [pendingSearch, setPendingSearch] = useState("");

  const [adminPage, setAdminPage] = useState(1);
  const [pendingPage, setPendingPage] = useState(1);

  const pageSize = 5;

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

        const [ticketsRes, statsRes, queriesRes] = await Promise.all([
          fetch("/api/tickets", { headers }),
          fetch("/api/tickets/stats", { headers }),
          fetch("/api/tickets/recent-queries", { headers }),
        ])

        if (!ticketsRes.ok || !statsRes.ok) {
          const errText = await ticketsRes.text().catch(() => "Error")
          throw new Error(`HTTP ${ticketsRes.status}: ${errText}`)
        }

        const ticketsData: Ticket[] = await ticketsRes.json()
        const stats = await statsRes.json()
        
        let queriesData: RecentQuery[] = []
        if (queriesRes.ok) {
          queriesData = await queriesRes.json()
          console.log("📊 Consultas recientes cargadas:", queriesData.length)
        } else {
          console.error("Error cargando consultas:", queriesRes.status)
        }

        setTickets(ticketsData)
        setRecentQueries(queriesData)

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

  const getEstadoBadgeColor = (estado: string) => {
    const estadoLower = estado.toLowerCase();
    if (estadoLower === 'resuelto' || estadoLower === 'resolved') {
      return 'bg-success/10 text-success border-success/20';
    } else if (estadoLower === 'en_proceso' || estadoLower === 'en proceso') {
      return 'bg-warning/10 text-warning border-warning/20';
    } else {
      return 'bg-destructive/10 text-destructive border-destructive/20';
    }
  };

  const formatTime = (d: Date) => d.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });


  const filteredAdmins = admins.filter(a =>
    a.nombre.toLowerCase().includes(adminSearch.toLowerCase()) ||
    a.email.toLowerCase().includes(adminSearch.toLowerCase())
  );

  const filteredPending = pendingUsers.filter(u =>
    u.nombre.toLowerCase().includes(pendingSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(pendingSearch.toLowerCase())
  );

  const adminTotalPages = Math.max(1, Math.ceil(filteredAdmins.length / 5));
  const pendingTotalPages = Math.max(1, Math.ceil(filteredPending.length / 5));

  const paginatedAdmins = filteredAdmins.slice((adminPage - 1) * 5, adminPage * 5);
  const paginatedPending = filteredPending.slice((pendingPage - 1) * 5, pendingPage * 5);

  useEffect(() => {
    setAdminPage(1);
  }, [adminSearch]);

  useEffect(() => {
    setPendingPage(1);
  }, [pendingSearch]);

  const handleOpenAdminsModal = () => {
    setAdminModalOpen(true);
    setSettingsMenuOpen(false);
  };

  const handleOpenPendingModal = () => {
    setPendingModalOpen(true);
    setSettingsMenuOpen(false);
  };

  const handleChangeUserRole = (userId: number, newRole: "admin" | "cliente") => {
  setPendingUsers(prev =>
    prev.map(u => u.id === userId ? { ...u, rol: newRole } : u)
  );

  const user = pendingUsers.find(u => u.id === userId);
  if (user && newRole === "admin") {
    setAdmins(prev => [
      ...prev,
      { id: user.id, nombre: user.nombre, email: user.email, rol: "admin", creadoEl: user.creadoEl }
    ]);
  }
};

  const handleApproveAndMakeAdmin = (userId: number) => {
  const user = pendingUsers.find(u => u.id === userId);
  if (user) {
    setAdmins(prev => [
      ...prev,
      { id: user.id, nombre: user.nombre, email: user.email, rol: "admin", creadoEl: user.creadoEl }
    ]);
  }
  setPendingUsers(prev => prev.filter(u => u.id !== userId));
};

const handleApproveAsClient = (userId: number) => {
  setPendingUsers(prev => prev.filter(u => u.id !== userId));
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

      <Dialog open={adminModalOpen} onOpenChange={setAdminModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Administradores</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/60"
                value={adminSearch}
                onChange={e => setAdminSearch(e.target.value)}
              />
            </div>

            <div className="border border-border/60 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="text-left px-3 py-2">Nombre</th>
                    <th className="text-left px-3 py-2">Email</th>
                    <th className="text-left px-3 py-2">Rol</th>
                    <th className="text-left px-3 py-2">Creado el</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAdmins.map(admin => (
                    <tr key={admin.id} className="border-t border-border/40">
                      <td className="px-3 py-2">{admin.nombre}</td>
                      <td className="px-3 py-2">{admin.email}</td>
                      <td className="px-3 py-2">
                        <Badge variant="outline" className="text-xs">
                          {admin.rol === "admin" ? "Administrador" : "Cliente"}
                        </Badge>
                      </td>
                      <td className="px-3 py-2">
                        {new Date(admin.creadoEl).toLocaleDateString("es-PE")}
                      </td>
                    </tr>
                  ))}

                  {paginatedAdmins.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-3 py-4 text-center text-muted-foreground text-sm">
                        No se encontraron administradores.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-end gap-2">
              <span className="text-xs text-muted-foreground mr-2">
                Página {adminPage} de {adminTotalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                disabled={adminPage === 1}
                onClick={() => setAdminPage(p => Math.max(1, p - 1))}
              >
                ‹
              </Button>
              <Button
                variant="outline"
                size="icon"
                disabled={adminPage === adminTotalPages}
                onClick={() => setAdminPage(p => Math.min(adminTotalPages, p + 1))}
              >
                ›
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={pendingModalOpen} onOpenChange={setPendingModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Cuentas por aprobar</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/60"
                value={pendingSearch}
                onChange={e => setPendingSearch(e.target.value)}
              />
            </div>

            <div className="border border-border/60 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="text-left px-3 py-2">Nombre</th>
                    <th className="text-left px-3 py-2">Email</th>
                    <th className="text-left px-3 py-2">Creado el</th>
                    <th className="px-3 py-2">
                    <div className="flex justify-center">
                      Acciones
                    </div>
                  </th>
                  </tr>
                </thead>
                <tbody>
  {paginatedPending.map(user => (
    <tr key={user.id} className="border-t border-border/40">
      <td className="px-3 py-2">{user.nombre}</td>
      <td className="px-3 py-2">{user.email}</td>
      <td className="px-3 py-2">
        {new Date(user.creadoEl).toLocaleDateString("es-PE")}
      </td>
      <td className="px-3 py-2 text-right space-x-2">
        <Button
          size="sm"
          variant="outline"
          className="text-xs"
          onClick={() => handleApproveAsClient(user.id)}
        >
          Aprobar como cliente
        </Button>
        <Button
          size="sm"
          className="text-xs"
          onClick={() => handleApproveAndMakeAdmin(user.id)}
        >
          Aprobar como admin
        </Button>
      </td>
    </tr>
  ))}

  {paginatedPending.length === 0 && (
    <tr>
      <td colSpan={4} className="px-3 py-4 text-center text-muted-foreground text-sm">
        No hay cuentas pendientes.
      </td>
    </tr>
  )}
</tbody>
              </table>
            </div>

            <div className="flex items-center justify-end gap-2">
              <span className="text-xs text-muted-foreground mr-2">
                Página {pendingPage} de {pendingTotalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                disabled={pendingPage === 1}
                onClick={() => setPendingPage(p => Math.max(1, p - 1))}
              >
                ‹
              </Button>
              <Button
                variant="outline"
                size="icon"
                disabled={pendingPage === pendingTotalPages}
                onClick={() => setPendingPage(p => Math.min(pendingTotalPages, p + 1))}
              >
                ›
              </Button>
            </div>
          </div>
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

            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSettingsMenuOpen(prev => !prev)}
              >
                <Settings className="h-4 w-4" />
              </Button>

              {settingsMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md border border-border/60 bg-card shadow-lg z-20">
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-accent/40 transition-colors"
                    onClick={handleOpenAdminsModal}
                  >
                    Administradores
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-accent/40 transition-colors"
                    onClick={handleOpenPendingModal}
                  >
                    Cuentas por aprobar
                  </button>
                </div>
              )}
            </div>

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
                          <div key={ticket.id} className="border border-border/50 rounded-lg p-3 space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-medium text-sm flex-1 line-clamp-2 pr-2">{ticket.detalle}</h4>
                              <Badge variant="outline" className={`${getEstadoBadgeColor(ticket.estado)} shrink-0`}>
                                {ticket.estado}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-muted-foreground">{ticket.user?.nombre || ticket.clienteNombre}</p>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>{new Date(ticket.createdAt).toLocaleDateString("es-ES", {
                                  day: "2-digit",
                                  month: "2-digit"
                                })} {new Date(ticket.createdAt).toLocaleTimeString("es-ES", {
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass-effect border-border/50">
                  <CardHeader>
                    <CardTitle>Últimas Consultas</CardTitle>
                    <CardDescription>Conversaciones recientes de los usuarios</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[350px]">
                      <div className="space-y-3 pr-4">
                        {recentQueries.length === 0 ? (
                          <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">
                            No hay consultas recientes
                          </div>
                        ) : (
                          recentQueries.map((query) => (
                            <Card
                              key={query.id}
                              className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
                                hoveredQuery === query.id
                                  ? "border-primary/50 bg-primary/5"
                                  : "border-border/40 bg-card/50 hover:bg-card/70"
                              }`}
                              onMouseEnter={() => setHoveredQuery(query.id)}
                              onMouseLeave={() => setHoveredQuery(null)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  <Avatar className="h-10 w-10 flex-shrink-0">
                                    <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold">
                                      {query.userName.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                      <p className="text-sm font-semibold text-foreground truncate">
                                        {query.userName}
                                      </p>
                                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                        {formatTime(new Date(query.timestamp))}
                                      </span>
                                    </div>
                                    
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                      {query.content}
                                    </p>
                                    
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-muted-foreground">
                                        Chat #{query.chatId}
                                      </span>
                                      <Badge variant="outline" className="text-xs">
                                        <MessageSquare className="h-3 w-3 mr-1" />
                                        Consulta
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-border/50">
                  <CardHeader>
                    <CardTitle>Distribución por Categorías</CardTitle>
                    <CardDescription>Tipos de consultas más frecuentes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData.categories}
                            cx="50%"
                            cy="50%"
                            outerRadius={110}
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
