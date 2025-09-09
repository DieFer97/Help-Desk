import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Users, Shield, Mail, Lock, User } from "lucide-react";
import heroImage from "@/assets/hero-ai.jpg";

interface LoginPageProps {
  onLogin: (userType: 'user' | 'admin') => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (userType: 'user' | 'admin') => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    onLogin(userType);
  };

  return (
    <div className="min-h-screen flex bg-gradient-background">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="AI Platform - Tecnología avanzada" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <div className="animate-fade-in-up">
            <Brain className="h-12 w-12 text-primary mb-6" />
            <h1 className="text-5xl font-bold mb-4 text-gradient">
              AI Platform
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Revoluciona tu negocio con inteligencia artificial avanzada. 
              Chat inteligente y gestión empresarial en una sola plataforma.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <span>Gestión inteligente de consultas</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-accent" />
                </div>
                <span>Dashboard administrativo avanzado</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-slide-in-right">
          <div className="text-center mb-8 lg:hidden">
            <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gradient">AI Platform</h1>
            <p className="text-muted-foreground">Soluciones Inteligentes</p>
          </div>

          <Card className="glass-effect border-border/50 shadow-elegant">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Bienvenido</CardTitle>
              <CardDescription>
                Accede a tu plataforma de IA personalizada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                  <TabsTrigger value="register">Registrarse</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="tu@email.com"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="••••••••"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-4">
                    <Button 
                      onClick={() => handleLogin('user')}
                      disabled={isLoading}
                      className="w-full bg-gradient-primary hover:opacity-90 text-white font-medium"
                    >
                      {isLoading ? "Iniciando..." : "Acceso Usuario"}
                    </Button>
                    <Button 
                      onClick={() => handleLogin('admin')}
                      disabled={isLoading}
                      variant="outline"
                      className="w-full border-primary/20 hover:bg-primary/10"
                    >
                      {isLoading ? "Iniciando..." : "Acceso Administrador"}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="register" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="name" 
                        type="text" 
                        placeholder="Tu nombre"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="reg-email" 
                        type="email" 
                        placeholder="tu@email.com"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="reg-password" 
                        type="password" 
                        placeholder="••••••••"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    disabled={isLoading}
                    className="w-full bg-gradient-primary hover:opacity-90 text-white font-medium mt-6"
                  >
                    {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
                  </Button>
                </TabsContent>
              </Tabs>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                ¿Necesitas ayuda? <a href="#" className="text-primary hover:underline">Contacta soporte</a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;