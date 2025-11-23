import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
} from "recharts";

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
      nombre: "Ricardo Palma",
      email: "ricardo99@gmail.com",
      rol: "cliente",
      creadoEl: "2025-11-25T20:49:33.215Z",
    },
    {
      id: 9,
      nombre: "Sosimo Sacramento",
      email: "sosimo32@gmail.com",
      rol: "cliente",
      creadoEl: "2025-11-02T21:39:24.215Z",
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

  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState({
    nombre: "Ricardo Kaká",
    email: "riki10@gmail.com",
    password: "",
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [notificationCount, setNotificationCount] = useState(0);

  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("authToken") || "";
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const [ticketsRes, statsRes, queriesRes] = await Promise.all([
        fetch("/api/tickets", { headers }),
        fetch("/api/tickets/stats", { headers }),
        fetch("/api/tickets/recent-queries", { headers }),
      ]);

      if (!ticketsRes.ok || !statsRes.ok) {
        const errText = await ticketsRes.text().catch(() => "Error");
        throw new Error(`HTTP ${ticketsRes.status}: ${errText}`);
      }

      const ticketsData: Ticket[] = await ticketsRes.json();
      const stats = await statsRes.json();

      let queriesData: RecentQuery[] = [];
      if (queriesRes.ok) {
        queriesData = await queriesRes.json();
        console.log("📊 Consultas recientes cargadas:", queriesData.length);
      } else {
        console.error("Error cargando consultas:", queriesRes.status);
      }

      setTickets(ticketsData);
      setRecentQueries(queriesData);

      setStats({
        totalUsers: stats.totalUsers || 0,
        activeChats: stats.totalChats || 0,
        criticalTickets: stats.criticalTickets || 0,
        resolvedToday: stats.resolvedToday || 0,
        totalTickets: stats.totalTickets || 0,
      });

      const pendingToday =
        (stats.totalTickets || 0) - (stats.resolvedToday || 0);
      setNotificationCount(pendingToday);

      const weeklyTickets = stats.weeklyTickets || [];
      const weeklyQueries = stats.weeklyQueries || [];

      const weeklyData: WeeklyData[] = weeklyTickets.map(
        (d: { name: string; tickets: number }, index: number) => ({
          name: d.name,
          tickets: d.tickets,
          consultas: weeklyQueries[index]?.consultas ?? 0,
        })
      );

      setChartData({
        weekly: weeklyData,
        categories: stats.categories || [],
      });
    } catch (err) {
      console.error("Error cargando dashboard:", err);
      setStats({
        totalUsers: 0,
        activeChats: 0,
        criticalTickets: 0,
        resolvedToday: 0,
        totalTickets: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateTicket = async (id: number, estado: string) => {
    try {
      const token = localStorage.getItem("authToken") || "";
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch(`/api/tickets/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ estado }),
      });

      if (!res.ok) throw new Error("Error actualizando ticket");

      const data = await res.json();
      const updatedTicket: Ticket = data.ticket;

      setTickets((prev) =>
        prev.map((t) => (t.id === id ? { ...t, estado: updatedTicket.estado } : t))
      );

      setSelectedTicket(null);

      if (estado === "resuelto") {
        setSuccessMessage(
          `Ticket ${updatedTicket.ticketId} resuelto exitosamente`
        );
        await fetchDashboardData();
      }
    } catch (err) {
      console.error("Error:", err);
      setSuccessMessage(null);
      alert("No se pudo actualizar el ticket");
    }
  };

  const handleDeleteTicket = async (id: number) => {
    if (!confirm("¿Seguro que quieres eliminar este ticket?")) return;

    try {
      const token = localStorage.getItem("authToken") || "";
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch(`/api/tickets/${id}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) throw new Error("Error eliminando ticket");

      setTickets(tickets.filter((t) => t.id !== id));
      setSelectedTicket(null);
      await fetchDashboardData();
    } catch (err) {
      console.error("Error:", err);
      alert("No se pudo eliminar el ticket");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-destructive text-destructive-foreground";
      case "high":
        return "bg-warning text-warning-foreground";
      case "medium":
        return "bg-accent text-accent-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getEstadoBadgeColor = (estado: string) => {
    const estadoLower = estado.toLowerCase();
    if (estadoLower === "resuelto" || estadoLower === "resolved") {
      return "bg-success/10 text-success border-success/20";
    } else if (estadoLower === "en_proceso" || estadoLower === "en proceso") {
      return "bg-warning/10 text-warning border-warning/20";
    } else {
      return "bg-destructive/10 text-destructive border-destructive/20";
    }
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });

  const filteredAdmins = admins.filter(
    (a) =>
      a.nombre.toLowerCase().includes(adminSearch.toLowerCase()) ||
      a.email.toLowerCase().includes(adminSearch.toLowerCase())
  );

  const filteredPending = pendingUsers.filter(
    (u) =>
      u.nombre.toLowerCase().includes(pendingSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(pendingSearch.toLowerCase())
  );

  const adminTotalPages = Math.max(1, Math.ceil(filteredAdmins.length / pageSize));
  const pendingTotalPages = Math.max(
    1,
    Math.ceil(filteredPending.length / pageSize)
  );

  const paginatedAdmins = filteredAdmins.slice(
    (adminPage - 1) * pageSize,
    adminPage * pageSize
  );
  const paginatedPending = filteredPending.slice(
    (pendingPage - 1) * pageSize,
    pendingPage * pageSize
  );

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

  const handleOpenEditProfileModal = () => {
    setEditProfileModalOpen(true);
    setSettingsMenuOpen(false);
  };

  const handleChangeUserRole = (userId: number, newRole: "admin" | "cliente") => {
    setPendingUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, rol: newRole } : u))
    );

    const user = pendingUsers.find((u) => u.id === userId);
    if (user && newRole === "admin") {
      setAdmins((prev) => [
        ...prev,
        {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          rol: "admin",
          creadoEl: user.creadoEl,
        },
      ]);
    }
  };

  const handleApproveAndMakeAdmin = (userId: number) => {
    const user = pendingUsers.find((u) => u.id === userId);
    if (user) {
      setAdmins((prev) => [
        ...prev,
        {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          rol: "admin",
          creadoEl: user.creadoEl,
        },
      ]);
    }
    setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const handleApproveAsClient = (userId: number) => {
    setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const sortedTickets = [...tickets].sort((a, b) => {
    const aResolved = a.estado.toLowerCase() === "resuelto";
    const bResolved = b.estado.toLowerCase() === "resuelto";

    if (aResolved === bResolved) {
      return (
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    if (aResolved) return 1;
    if (bResolved) return -1;
    return 0;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-background">
      <Dialog
        open={!!selectedTicket}
        onOpenChange={() => setSelectedTicket(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Ticket {selectedTicket?.ticketId}
              <DialogClose></DialogClose>
            </DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div>
                <p className="text-base font-medium">Cliente:</p>
                <p className="text-base">
                  {selectedTicket.user?.nombre || selectedTicket.clienteNombre}
                </p>
              </div>
              <div>
                <p className="text-base font-medium">Email:</p>
                <p className="text-base">
                  {selectedTicket.user?.email || "No disponible"}
                </p>
              </div>
              <div>
                <p className="text-base font-medium">Asunto:</p>
                <p className="text-base">{selectedTicket.asunto}</p>
              </div>
              <div>
                <p className="text-base font-medium">Detalle:</p>
                <p className="text-base">{selectedTicket.detalle}</p>
              </div>
              <div>
                <p className="text-base font-medium">Prioridad:</p>
                <Badge
                  className={getPriorityColor(
                    selectedTicket.prioridad === "crítica"
                      ? "critical"
                      : "high"
                  )}
                >
                  {selectedTicket.prioridad}
                </Badge>
              </div>
              <div>
                <p className="text-base font-medium">Estado:</p>
                <Badge className={getEstadoBadgeColor(selectedTicket.estado)}>
                  {selectedTicket.estado}
                </Badge>
              </div>
              <div>
                <p className="text-base font-medium">Creado:</p>
                <p className="text-base">
                  {new Date(selectedTicket.createdAt).toLocaleString("es-ES")}
                </p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    handleUpdateTicket(selectedTicket.id, "resuelto")
                  }
                >
                  <Check className="h-4 w-4 text-success" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteTicket(selectedTicket.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
                className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-base outline-none focus:ring-2 focus:ring-primary/60"
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
              />
            </div>

            <div className="border border-border/60 rounded-lg overflow-hidden">
              <table className="w-full text-base">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="text-left px-3 py-2">Nombre</th>
                    <th className="text-left px-3 py-2">Email</th>
                    <th className="text-left px-3 py-2">Rol</th>
                    <th className="text-left px-3 py-2">Creado el</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAdmins.map((admin) => (
                    <tr key={admin.id} className="border-t border-border/40">
                      <td className="px-3 py-2">{admin.nombre}</td>
                      <td className="px-3 py-2">{admin.email}</td>
                      <td className="px-3 py-2">
                        <Badge variant="outline" className="text-sm">
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
                      <td
                        colSpan={4}
                        className="px-3 py-4 text-center text-muted-foreground text-base"
                      >
                        No se encontraron administradores.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-end gap-2">
              <span className="text-sm text-muted-foreground mr-2">
                Página {adminPage} de {adminTotalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                disabled={adminPage === 1}
                onClick={() => setAdminPage((p) => Math.max(1, p - 1))}
              >
                ‹
              </Button>
              <Button
                variant="outline"
                size="icon"
                disabled={adminPage === adminTotalPages}
                onClick={() =>
                  setAdminPage((p) => Math.min(adminTotalPages, p + 1))
                }
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
                className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-base outline-none focus:ring-2 focus:ring-primary/60"
                value={pendingSearch}
                onChange={(e) => setPendingSearch(e.target.value)}
              />
            </div>

            <div className="border border-border/60 rounded-lg overflow-hidden">
              <table className="w-full text-base">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="text-left px-3 py-2">Nombre</th>
                    <th className="text-left px-3 py-2">Email</th>
                    <th className="text-left px-3 py-2">Creado el</th>
                    <th className="px-3 py-2">
                      <div className="flex justify-center">Acciones</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPending.map((user) => (
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
                          className="text-sm"
                          onClick={() => handleApproveAsClient(user.id)}
                        >
                          Aprobar como cliente
                        </Button>
                        <Button
                          size="sm"
                          className="text-sm"
                          onClick={() => handleApproveAndMakeAdmin(user.id)}
                        >
                          Aprobar como admin
                        </Button>
                      </td>
                    </tr>
                  ))}

                  {paginatedPending.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-3 py-4 text-center text-muted-foreground text-base"
                      >
                        No hay cuentas pendientes.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-end gap-2">
              <span className="text-sm text-muted-foreground mr-2">
                Página {pendingPage} de {pendingTotalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                disabled={pendingPage === 1}
                onClick={() => setPendingPage((p) => Math.max(1, p - 1))}
              >
                ‹
              </Button>
              <Button
                variant="outline"
                size="icon"
                disabled={pendingPage === pendingTotalPages}
                onClick={() =>
                  setPendingPage((p) => Math.min(pendingTotalPages, p + 1))
                }
              >
                ›
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={editProfileModalOpen} onOpenChange={setEditProfileModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar mi perfil</DialogTitle>
          </DialogHeader>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Datos actualizados (solo frontend)");
              setEditProfileModalOpen(false);
            }}
          >
            <div className="space-y-1">
              <label
                htmlFor="edit-name"
                className="text-base font-medium"
              >
                Nombre
              </label>
              <input
                id="edit-name"
                type="text"
                className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-base outline-none focus:ring-2 focus:ring-primary/60"
                value={currentAdmin.nombre}
                placeholder="Ingresa tu nombre"
                aria-label="Nombre del administrador"
                onChange={(e) =>
                  setCurrentAdmin((prev) => ({
                    ...prev,
                    nombre: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="edit-email"
                className="text-base font-medium"
              >
                Email
              </label>
              <input
                id="edit-email"
                type="email"
                className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-base outline-none focus:ring-2 focus:ring-primary/60"
                value={currentAdmin.email}
                placeholder="Ingresa tu email"
                aria-label="Email del administrador"
                onChange={(e) =>
                  setCurrentAdmin((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="edit-password"
                className="text-base font-medium"
              >
                Nueva contraseña
              </label>
              <input
                id="edit-password"
                type="password"
                className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-base outline-none focus:ring-2 focus:ring-primary/60"
                value={currentAdmin.password}
                placeholder="Deja vacío para no cambiarla"
                aria-label="Nueva contraseña del administrador"
                onChange={(e) =>
                  setCurrentAdmin((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
              />
              <p className="text-base text-muted-foreground">
                Si la dejas vacía, se mantiene la contraseña actual (demo).
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditProfileModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Guardar cambios</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!successMessage}
        onOpenChange={() => setSuccessMessage(null)}
      >
        <DialogContent className="max-w-base text-center">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              Ticket resuelto
            </DialogTitle>
          </DialogHeader>

          <p className="text-base text-muted-foreground mt-2">
            {successMessage}
          </p>

          <div className="mt-4 flex justify-center">
            <Button onClick={() => setSuccessMessage(null)}>Aceptar</Button>
          </div>
        </DialogContent>
      </Dialog>

      <header className="sticky top-0 z-10 border-b border-border/50 bg-card/30 backdrop-blur-base">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary p-1.5">
                <Shield className="w-full h-full text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gradient">
                Dashboard Admin
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-6 w-6" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-[10px] font-semibold text-white flex items-center justify-center">
                  {notificationCount > 99 ? "99+" : notificationCount}
                </span>
              )}
            </Button>

            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSettingsMenuOpen((prev) => !prev)}
              >
                <Settings className="h-6 w-6" />
              </Button>

              {settingsMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-md border border-border/60 bg-card shadow-lg z-20">
                  <button
                    className="w-full text-left px-3 py-2 text-base hover:bg-accent/40 transition-colors"
                    onClick={handleOpenAdminsModal}
                  >
                    Administradores
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-base hover:bg-accent/40 transition-colors"
                    onClick={handleOpenPendingModal}
                  >
                    Cuentas por aprobar
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-base hover:bg-accent/40 transition-colors border-t border-border/40"
                    onClick={handleOpenEditProfileModal}
                  >
                    Editar mi perfil
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
              <span className="text-base font-medium">Admin</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowLogoutDialog(true)}>
              <LogOut className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {loading ? (
            <div className="flex-1 flex items-center justify-center h-96">
              <div className="text-muted-foreground">
                Cargando datos del dashboard...
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="glass-effect border-border/50">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-medium">
                      Usuarios Activos
                    </CardTitle>
                    <Users className="h-5 w-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {stats.totalUsers.toLocaleString()}
                    </div>
                    <p className="text-base text-muted-foreground">
                      <span className="text-success">+12%</span> desde el mes
                      pasado
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-border/50">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-medium">
                      Chats Activos
                    </CardTitle>
                    <MessageSquare className="h-4 w-4 text-accent" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.activeChats}
                    </div>
                    <p className="text-base text-muted-foreground">
                      <span className="text-success">+5%</span> vs ayer
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-border/50">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-medium">
                      Tickets Generados
                    </CardTitle>
                    <AlertTriangle className="h-4 w-4 text-warning" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-warning">
                      {stats.totalTickets}
                    </div>
                    <p className="text-base text-muted-foreground">
                      Requieren atención inmediata
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-border/50">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-medium">
                      Resueltos Hoy
                    </CardTitle>
                    <CheckCircle className="h-4 w-4 text-success" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-success">
                      {stats.resolvedToday}
                    </div>
                    <p className="text-base text-muted-foreground">
                      Meta: 50 tickets
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 glass-effect border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-lg">
                      <TrendingUp className="h-6 w-6" />
                      <span>Actividad Semanal</span>
                    </CardTitle>
                    <CardDescription>
                      Consultas y tickets por día
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData.weekly}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="hsl(var(--border))"
                        />
                        <XAxis
                          dataKey="name"
                          stroke="hsl(var(--muted-foreground))"
                        />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
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
                    <CardTitle className="flex items-center justify-between text-lg">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-6 w-6 text-warning" />
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
                        {sortedTickets.slice(0, 5).map((ticket) => (
                          <div
                            key={ticket.id}
                            className="border border-border/50 rounded-lg p-3 space-y-3"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-medium text-base flex-1 line-clamp-2 pr-2">
                                {ticket.detalle}
                              </h4>
                              <Badge
                                variant="outline"
                                className={`${getEstadoBadgeColor(
                                  ticket.estado
                                )} shrink-0`}
                              >
                                {ticket.estado}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-base text-muted-foreground">
                                {ticket.user?.nombre ||
                                  ticket.clienteNombre}
                              </p>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>
                                  {new Date(
                                    ticket.createdAt
                                  ).toLocaleDateString("es-ES", {
                                    day: "2-digit",
                                    month: "2-digit",
                                  })}{" "}
                                  {new Date(
                                    ticket.createdAt
                                  ).toLocaleTimeString("es-ES", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full"
                              onClick={() => setSelectedTicket(ticket)}
                            >
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
                    <CardDescription>
                      Conversaciones recientes de los usuarios
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[350px]">
                      <div className="space-y-3 pr-4">
                        {recentQueries.length === 0 ? (
                          <div className="flex items-center justify-center h-[300px] text-muted-foreground text-base">
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
                              onMouseEnter={() =>
                                setHoveredQuery(query.id)
                              }
                              onMouseLeave={() =>
                                setHoveredQuery(null)
                              }
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  <Avatar className="h-10 w-10 flex-shrink-0">
                                    <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold">
                                      {query.userName
                                        .charAt(0)
                                        .toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                      <p className="text-base font-semibold text-foreground truncate">
                                        {query.userName}
                                      </p>
                                      <span className="text-base text-muted-foreground whitespace-nowrap ml-2">
                                        {formatTime(
                                          new Date(query.timestamp)
                                        )}
                                      </span>
                                    </div>

                                    <p className="text-base text-muted-foreground line-clamp-2 mb-2">
                                      {query.content}
                                    </p>

                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-muted-foreground">
                                        Chat #{query.chatId}
                                      </span>
                                      <Badge
                                        variant="outline"
                                        className="text-sm"
                                      >
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
                    <CardDescription>
                      Tipos de consultas más frecuentes
                    </CardDescription>
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
                            label={({ name, percent }) =>
                              `${name} ${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {chartData.categories.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                              />
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
