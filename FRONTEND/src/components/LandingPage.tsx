import { Button } from "@/components/ui/button";
import { Brain, Code2, Database, GitBranch, Layers, MessageSquare, Rocket, Server, Sparkles, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface LandingPageProps {
  onStartLogin: () => void;
}

const LandingPage = ({ onStartLogin }: LandingPageProps) => {
  const [activeSection, setActiveSection] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      const sections = document.querySelectorAll('.section-container');
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
          setActiveSection(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (index: number) => {
    const sections = document.querySelectorAll('.section-container');
    sections[index]?.scrollIntoView({ behavior: 'smooth' });
  };

  const technologies = [
    { icon: Brain, name: "Ollama AI", color: "text-primary", description: "Modelos Llava y Qwen3" },
    { icon: Code2, name: "React + TypeScript", color: "text-accent", description: "Frontend moderno" },
    { icon: Server, name: "N8N Workflows", color: "text-success", description: "Automatización inteligente" },
    { icon: Database, name: "PostgreSQL", color: "text-warning", description: "Base de datos robusta" },
    { icon: Layers, name: "Prisma ORM", color: "text-primary-glow", description: "Gestión de datos" },
    { icon: GitBranch, name: "Express.js", color: "text-accent", description: "Backend escalable" },
  ];

  const features = [
    {
      icon: MessageSquare,
      title: "Chatbot IA Conversacional",
      description: "Asistente virtual inteligente con procesamiento de lenguaje natural y memoria contextual.",
      gradient: "from-primary to-accent"
    },
    {
      icon: Brain,
      title: "Análisis Multimodal",
      description: "Procesamiento de texto e imágenes con modelos de IA locales para diagnóstico de problemas.",
      gradient: "from-accent to-success"
    },
    {
      icon: Zap,
      title: "Gestión Automática de Tickets",
      description: "Clasificación inteligente y escalamiento automático a soporte especializado.",
      gradient: "from-success to-warning"
    },
    {
      icon: Sparkles,
      title: "Respuestas Contextuales",
      description: "Sistema que aprende del historial de conversación para respuestas personalizadas.",
      gradient: "from-warning to-primary"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 animate-pulse-glow blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/10 blur-3xl [animation:pulse-glow_3s_ease-in-out_infinite_1s]" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-success/10 blur-3xl [animation:pulse-glow_3s_ease-in-out_infinite_2s]" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">CISTCOR AI</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {['Inicio', 'Proyecto', 'Tecnologías', 'Características'].map((item, index) => (
              <button
                key={item}
                onClick={() => scrollToSection(index)}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  activeSection === index ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <Button 
            onClick={onStartLogin}
            className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow"
          >
            Iniciar Sesión
          </Button>
        </div>
      </nav>

      <section className={`section-container min-h-screen flex items-center justify-center pt-20 px-6 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="container mx-auto text-center z-10">
          <div className="mb-8 inline-block">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-primary p-6 shadow-glow animate-pulse-glow">
              <Rocket className="w-full h-full text-white" />
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-gradient mb-6 animate-fade-in-up">
            Help Desk con IA
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground mb-4 animate-fade-in-up [animation-delay:0.2s]">
            Sistema Inteligente de Soporte Técnico
          </p>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up [animation-delay:0.4s]">
            Proyecto de Tesis - Ingeniería de Software con Inteligencia Artificial
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up [animation-delay:0.6s]">
            <Button 
              onClick={onStartLogin}
              size="lg"
              className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow text-lg px-8 py-6"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Comenzar Ahora
            </Button>
            <Button 
              onClick={() => scrollToSection(1)}
              size="lg"
              variant="outline"
              className="border-primary/50 hover:bg-primary/10 text-lg px-8 py-6"
            >
              Conocer Más
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { label: "IA Local", value: "Ollama", delay: "0.8s" },
              { label: "Respuestas", value: "< 2s", delay: "1s" },
              { label: "Precisión", value: "95%", delay: "1.2s" }
            ].map((stat) => (
              <div 
                key={stat.label} 
                className={`glass-effect p-6 rounded-2xl border border-primary/20 animate-fade-in-up [animation-delay:${stat.delay}]`}
              >
                <div className="text-3xl font-bold text-gradient mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-container min-h-screen flex items-center justify-center px-6 py-20">
        <div className="container mx-auto z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gradient mb-4">Sobre el Proyecto</h2>
            <p className="text-xl text-muted-foreground">Innovación en soporte técnico empresarial</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="glass-effect p-8 rounded-3xl border border-primary/20 hover:border-primary/40 transition-all hover:shadow-glow">
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary p-4 mb-6 shadow-glow">
                <Brain className="w-full h-full text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Problemática</h3>
              <p className="text-muted-foreground leading-relaxed">
                Las empresas enfrentan altos tiempos de respuesta en soporte técnico, costos elevados de personal, 
                y dificultad para escalar servicios durante picos de demanda. Los sistemas tradicionales carecen de 
                inteligencia contextual y capacidad de análisis visual.
              </p>
            </div>

            <div className="glass-effect p-8 rounded-3xl border border-accent/20 hover:border-accent/40 transition-all hover:shadow-glow">
              <div className="w-16 h-16 rounded-2xl bg-gradient-accent p-4 mb-6 shadow-glow">
                <Zap className="w-full h-full text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Solución</h3>
              <p className="text-muted-foreground leading-relaxed">
                Sistema Help Desk con IA que combina procesamiento de lenguaje natural, análisis de imágenes, 
                clasificación inteligente de consultas, y gestión automática de tickets. Reduce tiempos de respuesta 
                en un 70% y mejora la satisfacción del cliente.
              </p>
            </div>

            <div className="glass-effect p-8 rounded-3xl border border-success/20 hover:border-success/40 transition-all hover:shadow-glow md:col-span-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-success to-accent p-4 mb-6 shadow-glow">
                <Layers className="w-full h-full text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Objetivos del Proyecto</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-accent mb-3">Objetivo General</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Desarrollar e implementar un sistema Help Desk inteligente con capacidades de IA multimodal 
                    para CISTCOR, automatizando la atención al cliente y optimizando la gestión de tickets de soporte.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-primary mb-3">Objetivos Específicos</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Implementar chatbot conversacional con IA local</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Integrar análisis de imágenes para diagnóstico visual</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Automatizar clasificación y escalamiento de tickets</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Reducir tiempos de respuesta y costos operativos</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-container min-h-screen flex items-center justify-center px-6 py-20">
        <div className="container mx-auto z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gradient mb-4">Stack Tecnológico</h2>
            <p className="text-xl text-muted-foreground">Herramientas de vanguardia para soluciones innovadoras</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
            {technologies.map((tech, index) => {
              const Icon = tech.icon;
              const delayClass = `[animation-delay:${index * 0.1}s]`;
              return (
                <div 
                  key={tech.name}
                  className={`glass-effect p-6 rounded-2xl border border-primary/20 hover:border-primary/40 transition-all hover:shadow-glow hover:-translate-y-1 cursor-pointer animate-fade-in-up ${delayClass}`}
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-primary p-3 mb-4 shadow-glow ${tech.color}`}>
                    <Icon className="w-full h-full" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{tech.name}</h3>
                  <p className="text-sm text-muted-foreground">{tech.description}</p>
                </div>
              );
            })}
          </div>

          <div className="glass-effect p-8 rounded-3xl border border-primary/20 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gradient mb-6 text-center">Arquitectura del Sistema</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">01</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Frontend React + TypeScript</h4>
                  <p className="text-sm text-muted-foreground">Interfaz moderna con Tailwind CSS y Shadcn UI</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-accent font-bold">02</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Backend Express.js + Prisma</h4>
                  <p className="text-sm text-muted-foreground">API RESTful con autenticación JWT y gestión de datos</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-success font-bold">03</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">N8N Automation Workflows</h4>
                  <p className="text-sm text-muted-foreground">Orquestación de IA, webhooks y procesamiento multimodal</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-warning font-bold">04</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Ollama AI Local Models</h4>
                  <p className="text-sm text-muted-foreground">Llava 7b para imágenes, Qwen3-coder para texto</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-container min-h-screen flex items-center justify-center px-6 py-20">
        <div className="container mx-auto z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gradient mb-4">Características Principales</h2>
            <p className="text-xl text-muted-foreground">Funcionalidades que transforman el soporte técnico</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const delayClass = `[animation-delay:${index * 0.15}s]`;
              return (
                <div 
                  key={feature.title}
                  className={`glass-effect p-8 rounded-3xl border border-primary/20 hover:border-primary/40 transition-all hover:shadow-glow hover:-translate-y-2 animate-fade-in-up ${delayClass}`}
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} p-4 mb-6 shadow-glow`}>
                    <Icon className="w-full h-full text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <div className="glass-effect inline-block p-8 rounded-3xl border border-primary/20 mb-8">
              <p className="text-lg text-muted-foreground mb-6">
                Proyecto desarrollado por Diego Malpartida, estudiante de Ingeniería de Software con IA
              </p>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-foreground">Instituto SENATI</p>
                  <p className="text-sm text-muted-foreground">Perú - 2025</p>
                </div>
              </div>
            </div>

            <Button 
              onClick={onStartLogin}
              size="lg"
              className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow text-xl px-12 py-8"
            >
              <Sparkles className="w-6 h-6 mr-2" />
              Iniciar Sistema
            </Button>
          </div>
        </div>
      </section>

      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col space-y-4">
        {['Inicio', 'Proyecto', 'Tecnologías', 'Características'].map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToSection(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              activeSection === index 
                ? 'bg-primary w-4 h-4 shadow-glow' 
                : 'bg-muted hover:bg-primary/50'
            }`}
            aria-label={`Ir a sección ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
