import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  AlertTriangle,
  Users,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  LogOut,
  Settings,
  Bell,
  Filter,
  Download,
  Brain,
  Zap,
  Shield
} from "lucide-react";

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [activeFilter, setActiveFilter] = useState("all");

  // Mock data - in real app would come from backend
  const stats = {
    totalUsers: 1247,
    activeChats: 89,
    criticalTickets: 12,
    resolvedToday: 43
  };

  const chartData = {
    weekly: [
      { name: 'Lun', consultas: 65, tickets: 8 },
      { name: 'Mar', consultas: 78, tickets: 12 },
      { name: 'Mié', consultas: 90, tickets: 6 },
      { name: 'Jue', consultas: 81, tickets: 15 },
      { name: 'Vie', consultas: 95, tickets: 9 },
      { name: 'Sáb', consultas: 42, tickets: 3 },
      { name: 'Dom', consultas: 38, tickets: 2 }
    ],
    categories: [
      { name: 'Técnico', value: 35, color: '#8b5cf6' },
      { name: 'Facturación', value: 25, color: '#06b6d4' },
      { name: 'Soporte', value: 20, color: '#10b981' },
      { name: 'Ventas', value: 20, color: '#f59e0b' }
    ]
  };

  const criticalTickets = [
    {
      id: 'T-001',
      user: 'María González',
      subject: 'Error crítico en facturación automática',
      priority: 'high',
      status: 'open',
      timestamp: '10:30 AM',
      messages: 15
    },
    {
      id: 'T-002',
      user: 'Carlos Ruiz',
      subject: 'Falla en integración API payments',
      priority: 'critical',
      status: 'in-progress',
      timestamp: '9:15 AM',
      messages: 23
    },
    {
      id: 'T-003',
      user: 'Ana Martín',
      subject: 'Problema con autenticación SSO',
      priority: 'high',
      status: 'open',
      timestamp: '8:45 AM',
      messages: 8
    }
  ];

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
      {/* Header */}
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

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="space-y-6">
            {/* Stats Cards */}
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
                  <CardTitle className="text-sm font-medium">Tickets Críticos</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-warning" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-warning">{stats.criticalTickets}</div>
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

            {/* Charts and Critical Tickets */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Activity Chart */}
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

              {/* Critical Tickets */}
              <Card className="glass-effect border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-warning" />
                      <span>Tickets Críticos</span>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-80">
                    <div className="space-y-4">
                      {criticalTickets.map((ticket) => (
                        <div key={ticket.id} className="border border-border/50 rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge className={getPriorityColor(ticket.priority)}>
                              {ticket.priority}
                            </Badge>
                            <Badge variant="outline" className={getStatusColor(ticket.status)}>
                              {ticket.status}
                            </Badge>
                          </div>
                          <h4 className="font-medium text-sm">{ticket.subject}</h4>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{ticket.user}</span>
                            <div className="flex items-center space-x-2">
                              <MessageSquare className="h-3 w-3" />
                              <span>{ticket.messages}</span>
                              <Clock className="h-3 w-3" />
                              <span>{ticket.timestamp}</span>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" className="w-full">
                            Ver Ticket
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Categories Pie Chart */}
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
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;