import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Award,
  Brain,
  CheckCircle2,
  Layers,
  MessageSquare,
  Rocket,
  Sparkles,
  Zap
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  SiExpress,
  SiN8N,
  SiOllama,
  SiPostgresql,
  SiPrisma,
  SiReact,
  SiTwilio,
  SiTypescript,
  SiVite,
} from "react-icons/si";

interface LandingPageProps {
  onStartLogin: () => void;
}

const sections = ["Inicio", "Proyecto", "Tecnologías", "Características"];

const LandingPage = ({ onStartLogin }: LandingPageProps) => {
  const [activeSection, setActiveSection] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      const nodes = document.querySelectorAll(".section-container");
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      nodes.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + window.scrollY;
        const sectionBottom = sectionTop + rect.height;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          setActiveSection((prev) => (prev !== index ? index : prev));
        }
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (index: number) => {
    const nodes = document.querySelectorAll(".section-container");
    nodes[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const technologies = [
    {
      icon: SiOllama,
      name: "Ollama AI",
      description: "Modelos Llava y Qwen3",
      bgColor: "bg-slate-500/10",
      borderColor: "border-slate-500/30",
      iconColor: "text-slate-200",
    },
    {
      icon: SiReact,
      name: "React",
      description: "Frontend moderno",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/30",
      iconColor: "text-cyan-400",
    },
    {
      icon: SiTypescript,
      name: "TypeScript",
      description: "Tipado estático",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      iconColor: "text-blue-400",
    },
    {
      icon: SiN8N,
      name: "N8N Workflows",
      description: "Automatización inteligente",
      bgColor: "bg-pink-500/10",
      borderColor: "border-pink-500/30",
      iconColor: "text-pink-400",
    },
    {
      icon: SiPostgresql,
      name: "PostgreSQL",
      description: "Base de datos robusta",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/30",
      iconColor: "text-indigo-400",
    },
    {
      icon: SiPrisma,
      name: "Prisma ORM",
      description: "Gestión de datos",
      bgColor: "bg-slate-500/10",
      borderColor: "border-slate-500/30",
      iconColor: "text-slate-200",
    },
    {
      icon: SiExpress,
      name: "Express.js",
      description: "Backend escalable",
      bgColor: "bg-gray-500/10",
      borderColor: "border-gray-500/30",
      iconColor: "text-gray-200",
    },
    {
      icon: SiVite,
      name: "Vite",
      description: "Build tool ultrarrápido",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
      iconColor: "text-purple-400",
    },
    {
      icon: SiTwilio,
      name: "Twilio",
      description: "Comunicaciones API",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
      iconColor: "text-red-400",
    },
  ];

  const features = [
    {
      icon: MessageSquare,
      title: "Chatbot IA Conversacional",
      description:
        "Asistente virtual inteligente con procesamiento de lenguaje natural y memoria contextual.",
      gradient: "from-primary to-accent",
      bgGlow: "bg-blue-500/10",
      badge: "IA Avanzada",
      uptime: "99.9%",
      uptimeWidth: "96%",
      latency: "1.8 s",
      latencyWidth: "90%",
    },
    {
      icon: Brain,
      title: "Análisis Multimodal",
      description:
        "Procesamiento de texto e imágenes con modelos de IA locales para diagnóstico de problemas.",
      gradient: "from-accent to-success",
      bgGlow: "bg-purple-500/10",
      badge: "Visión IA",
      uptime: "99.5%",
      uptimeWidth: "92%",
      latency: "2.3 s",
      latencyWidth: "84%",
    },
    {
      icon: Zap,
      title: "Gestión Automática de Tickets",
      description:
        "Clasificación inteligente y escalamiento automático a soporte especializado.",
      gradient: "from-success to-warning",
      bgGlow: "bg-green-500/10",
      badge: "Automatizado",
      uptime: "99.7%",
      uptimeWidth: "94%",
      latency: "1.6 s",
      latencyWidth: "88%",
    },
    {
      icon: Sparkles,
      title: "Respuestas Contextuales",
      description:
        "Sistema que aprende del historial de conversación para respuestas personalizadas.",
      gradient: "from-warning to-primary",
      bgGlow: "bg-yellow-500/10",
      badge: "Smart AI",
      uptime: "99.2%",
      uptimeWidth: "90%",
      latency: "2.1 s",
      latencyWidth: "82%",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden text-slate-50">
      <div className="pointer-events-none absolute inset-0 opacity-25">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#3b82f620,_transparent_55%),radial-gradient(circle_at_bottom,_#ec489920,_transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:5rem_5rem]" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-px rounded-md bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-pink-500/30 blur-2" />
              <Brain className="relative w-5 h-5 text-slate-50" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium tracking-[0.25em] text-slate-400 uppercase">
                CISTCOR
              </span>
              <span className="text-lg font-semibold text-slate-50">
                CistBot AI Console
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1 rounded-full bg-slate-900/80 border border-white/10 px-2 py-1">
            {sections.map((item, index) => (
              <button
                key={item}
                onClick={() => scrollToSection(index)}
                className={`px-4 py-1.5 text-xs font-medium rounded-full transition-colors
                ${
                  activeSection === index
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-emerald-500/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-emerald-300">
                Motor IA estable
              </span>
            </div>
            <Button
              onClick={onStartLogin}
              className="bg-slate-50 text-slate-950 hover:bg-slate-200 font-semibold px-4 py-2 rounded-lg text-sm flex items-center gap-2"
            >
              Iniciar sesión
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      <section
        className={`section-container min-h-screen flex items-center justify-center pt-24 px-6 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <div className="container mx-auto max-w-6xl grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.9fr)] gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/40 bg-blue-500/10 px-3 py-1.5">
              <span className="h-1.5 w-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-blue-200">
                Proyecto de Tesis 2025
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-slate-50 leading-tight">
                Help-Desk{" "}
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  con IA
                </span>
              </h1>
              <p className="text-base md:text-lg text-slate-300 max-w-xl">
                Orquesta chatbots, análisis de imágenes y automatización de
                tickets en una sola superficie de trabajo, diseñada para equipos
                de soporte que operan a nivel empresarial.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-200">
              <div className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                <span>IA local con modelos Ollama para texto e imagen.</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                <span>Respuesta promedio por debajo de 2 segundos.</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                <span>Workflows n8n para escalamiento y notificaciones.</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                <span>Arquitectura auditable y trazable para soporte crítico.</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button
                onClick={onStartLogin}
                size="lg"
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-medium px-8 py-5 rounded-xl text-sm md:text-base"
              >
                Activar consola
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <button
                onClick={() => scrollToSection(1)}
                className="text-sm text-slate-300 hover:text-white inline-flex items-center gap-2"
              >
                Ver arquitectura de IA
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-tr from-blue-500/20 via-purple-500/10 to-pink-500/20 blur-3xl opacity-80" />

            <div className="relative rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-medium text-slate-300">
                    Núcleo IA operativo
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                  <span>Telemetría Help Desk</span>
                </div>
              </div>

              <div className="relative flex items-center justify-center py-4">
                <div className="absolute w-40 h-40 rounded-full border border-blue-500/30" />
                <div className="absolute w-24 h-24 rounded-full border border-purple-500/40 rotate-12" />
                <div className="absolute w-12 h-12 rounded-full border border-pink-500/40 -rotate-6" />
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-xs">
                {[
                  {
                    label: "Tickets resueltos",
                    value: "95%",
                    bar: "from-emerald-400 to-emerald-500",
                    width: "92%",
                  },
                  {
                    label: "Tiempo respuesta",
                    value: "<2s",
                    bar: "from-blue-400 to-cyan-400",
                    width: "96%",
                  },
                  {
                    label: "Escalamientos auto",
                    value: "70%",
                    bar: "from-purple-400 to-pink-400",
                    width: "80%",
                  },
                ].map((kpi) => (
                  <div key={kpi.label} className="space-y-1">
                    <div className="text-[11px] text-slate-400">{kpi.label}</div>
                    <div className="text-sm font-semibold text-slate-50">
                      {kpi.value}
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${kpi.bar}`}
                        style={{ width: kpi.width }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/5">
                <div className="rounded-xl bg-slate-900/80 border border-white/10 p-3 flex flex-col gap-2">
                  <span className="text-[10px] text-slate-400 uppercase tracking-[0.16em]">
                    Frontend
                  </span>
                  <div className="flex items-center gap-2 text-xs text-slate-100">
                    <SiReact className="w-4 h-4 text-cyan-400" />
                    <span>React + TS</span>
                  </div>
                </div>
                <div className="rounded-xl bg-slate-900/80 border border-white/10 p-3 flex flex-col gap-2">
                  <span className="text-[10px] text-slate-400 uppercase tracking-[0.16em]">
                    Orquestación
                  </span>
                  <div className="flex items-center gap-2 text-xs text-slate-100">
                    <SiN8N className="w-4 h-4 text-pink-400" />
                    <span>Workflows n8n</span>
                  </div>
                </div>
                <div className="rounded-xl bg-slate-900/80 border border-white/10 p-3 flex flex-col gap-2">
                  <span className="text-[10px] text-slate-400 uppercase tracking-[0.16em]">
                    IA local
                  </span>
                  <div className="flex items-center gap-2 text-xs text-slate-100">
                    <SiOllama className="w-4 h-4 text-slate-200" />
                    <span>Ollama</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-container min-h-screen flex items-center justify-center px-6 py-20">
        <div className="container mx-auto max-w-7xl space-y-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 backdrop-blur">
                <Award className="w-5 h-5 text-blue-400" />
                <span className="text-xs font-semibold text-blue-300 tracking-[0.18em] uppercase">
                  Proyecto de tesis
                </span>
              </div>
              <h2 className="mt-4 text-4xl md:text-5xl font-semibold">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Impacto en soporte técnico
                </span>
              </h2>
              <p className="mt-2 text-sm md:text-base text-slate-300 max-w-xl">
                De un modelo reactivo y manual a una consola de IA que orquesta,
                prioriza y resuelve solicitudes con visibilidad completa.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 md:w-[360px]">
              <div className="rounded-2xl bg-red-500/5 border border-red-500/40 p-3">
                <div className="text-[11px] text-red-300 uppercase tracking-[0.16em]">
                  Antes
                </div>
                <div className="mt-1 text-xl font-semibold text-red-100">
                  +40 min
                </div>
                <div className="text-[11px] text-red-200">
                  Tiempo medio de respuesta
                </div>
              </div>
              <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/40 p-3">
                <div className="text-[11px] text-emerald-300 uppercase tracking-[0.16em]">
                  Después
                </div>
                <div className="mt-1 text-xl font-semibold text-emerald-100">
                  -70%
                </div>
                <div className="text-[11px] text-emerald-200">
                  Reducción tiempos y carga
                </div>
              </div>
              <div className="rounded-2xl bg-sky-500/5 border border-sky-500/40 p-3">
                <div className="text-[11px] text-sky-300 uppercase tracking-[0.16em]">
                  Visibilidad
                </div>
                <div className="mt-1 text-xl font-semibold text-sky-100">
                  360°
                </div>
                <div className="text-[11px] text-sky-200">
                  Estado del soporte
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-8">
            <div className="rounded-3xl bg-gradient-to-br from-red-500/10 via-orange-500/5 to-slate-900/80 border border-red-500/40 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      Problemática actual
                    </h3>
                    <p className="text-xs text-red-100/80">
                      Soporte reactivo, manual y costoso.
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/40 text-[11px] font-semibold text-red-200">
                  Modo legado
                </span>
              </div>

              <p className="text-sm text-slate-100/90 leading-relaxed">
                Las empresas enfrentan altos tiempos de respuesta, costos
                elevados de personal y dificultad para escalar servicios durante
                picos de demanda, con poca inteligencia contextual y sin
                análisis visual integrado.
              </p>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="rounded-2xl bg-slate-950/70 border border-red-500/30 p-3 space-y-1">
                  <div className="text-[11px] text-red-200 uppercase tracking-[0.16em]">
                    Fricción
                  </div>
                  <div className="text-sm font-semibold text-red-100">
                    Respuesta lenta
                  </div>
                  <p className="text-[11px] text-red-100/80">
                    Colas de tickets sin priorización inteligente.
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-950/70 border border-orange-500/30 p-3 space-y-1">
                  <div className="text-[11px] text-orange-200 uppercase tracking-[0.16em]">
                    Costo
                  </div>
                  <div className="text-sm font-semibold text-orange-100">
                    Plantillas sobredimensionadas
                  </div>
                  <p className="text-[11px] text-orange-100/80">
                    Escalamientos manuales y procesos repetitivos.
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-950/70 border border-rose-500/30 p-3 space-y-1">
                  <div className="text-[11px] text-rose-200 uppercase tracking-[0.16em]">
                    Visión
                  </div>
                  <div className="text-sm font-semibold text-rose-100">
                    Sin contexto visual
                  </div>
                  <p className="text-[11px] text-rose-100/80">
                    Falta de análisis de capturas y evidencias.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-slate-900/80 border border-green-500/40 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      Solución propuesta
                    </h3>
                    <p className="text-xs text-emerald-100/80">
                      Consola Help Desk con IA multimodal.
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-[11px] font-semibold text-emerald-200">
                  Modo IA
                </span>
              </div>

              <p className="text-sm text-slate-100/90 leading-relaxed">
                Sistema Help Desk con IA que combina procesamiento de lenguaje
                natural, análisis de imágenes, clasificación inteligente y
                gestión automática de tickets, reduciendo tiempos de respuesta
                hasta en un 70% y mejorando la satisfacción del cliente.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-2xl bg-slate-950/70 border border-emerald-500/30 p-3 space-y-1">
                  <div className="text-[11px] text-emerald-200 uppercase tracking-[0.16em]">
                    Orquestación
                  </div>
                  <p className="text-[11px] text-emerald-100/90 leading-relaxed">
                    Chatbot IA, análisis de imágenes y workflows n8n en una
                    única capa de automatización.
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-950/70 border border-emerald-500/30 p-3 space-y-1">
                  <div className="text-[11px] text-emerald-200 uppercase tracking-[0.16em]">
                    Impacto
                  </div>
                  <p className="text-[11px] text-emerald-100/90 leading-relaxed">
                    Reducción de carga manual, respuestas más consistentes y
                    mejor experiencia para el usuario final.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <span className="px-3 py-1.5 rounded-full bg-green-500/15 border border-green-500/30 text-[11px] text-green-200 font-semibold">
                  ✨ IA Avanzada
                </span>
                <span className="px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[11px] text-emerald-200 font-semibold">
                  🚀 70% más rápido
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-950/80 border border-blue-500/40 p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  Objetivos del proyecto
                </h3>
                <p className="text-xs text-slate-300">
                  Alineados a la operación real de un Help Desk empresarial.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.3fr)] gap-5">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                  <h4 className="text-lg font-semibold text-white">
                    Objetivo general
                  </h4>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  Desarrollar e implementar un sistema Help Desk inteligente con
                  capacidades de IA multimodal para CISTCOR, automatizando la
                  atención al cliente y optimizando la gestión de tickets de
                  soporte.
                </p>
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                  <h4 className="text-lg font-semibold text-white">
                    Objetivos específicos
                  </h4>
                </div>
                <ul className="space-y-2.5 text-sm text-slate-200">
                  {[
                    "Implementar chatbot conversacional con IA local.",
                    "Integrar análisis de imágenes para diagnóstico visual.",
                    "Automatizar clasificación y escalamiento de tickets.",
                    "Reducir tiempos de respuesta y costos operativos.",
                  ].map((objetivo, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 group/item"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5" />
                      <span>{objetivo}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-container min-h-screen flex items-center justify-center px-6 py-20">
        <div className="container mx-auto max-w-7xl space-y-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 backdrop-blur">
              <SiReact className="w-5 h-5 text-cyan-400" />
              <span className="text-xs font-semibold text-purple-300 tracking-[0.18em] uppercase">
                Stack tecnológico
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Arquitectura de la consola
              </span>
            </h2>
            <p className="text-sm md:text-base text-slate-300">
              Cada componente cumple un rol claro dentro del circuito de
              atención automatizada.
            </p>
          </div>

          <div className="rounded-3xl bg-slate-950/85 border border-indigo-500/40 p-6 lg:p-8 space-y-6">
            <div className="grid md:grid-cols-4 gap-5 text-xs">
              {[
                {
                  title: "Capa cliente",
                  items: ["React + TypeScript", "Tailwind CSS", "shadcn/ui"],
                  icon: SiReact,
                  color: "text-cyan-400",
                },
                {
                  title: "Orquestación IA",
                  items: ["n8n workflows", "Webhooks", "Procesamiento multimodal"],
                  icon: SiN8N,
                  color: "text-pink-400",
                },
                {
                  title: "Modelos locales",
                  items: ["Ollama Llava 7b", "Qwen3-coder", "Contexto extendido"],
                  icon: SiOllama,
                  color: "text-slate-200",
                },
                {
                  title: "Datos y servicios",
                  items: ["Express.js + Prisma", "PostgreSQL", "Twilio API"],
                  icon: SiPostgresql,
                  color: "text-indigo-400",
                },
              ].map((block, idx) => {
                const Icon = block.icon;
                return (
                  <div
                    key={block.title}
                    className="relative rounded-2xl bg-slate-900/80 border border-white/10 p-4 flex flex-col gap-3"
                  >
                    {idx < 3 && (
                      <div className="hidden md:block absolute right-[-10px] top-1/2 -translate-y-1/2 w-5 h-[1px] bg-gradient-to-r from-slate-500/60 to-indigo-400/80" />
                    )}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-950/80 border border-white/10 flex items-center justify-center">
                        <Icon className={`w-4 h-4 ${block.color}`} />
                      </div>
                      <h3 className="text-sm font-semibold text-white">
                        {block.title}
                      </h3>
                    </div>
                    <ul className="space-y-1">
                      {block.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-1.5 text-slate-300"
                        >
                          <span className="mt-1 h-1 w-1 rounded-full bg-slate-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            <div className="grid md:grid-cols-3 lg:grid-cols-4.5 gap-4 pt-4 border-t border-white/10">
              {technologies.map((tech) => {
                const Icon = tech.icon;
                return (
                  <div
                    key={tech.name}
                    className={`group relative backdrop-blur ${tech.bgColor} p-4 rounded-2xl border ${tech.borderColor} transition-colors hover:border-opacity-70`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-950/80 border border-white/10 flex items-center justify-center">
                        <Icon className={`w-5 h-5 ${tech.iconColor}`} />
                      </div>
                      <div className="space-y-0.5">
                        <h3 className="text-sm font-semibold text-white">
                          {tech.name}
                        </h3>
                        <p className="text-[11px] text-slate-300">
                          {tech.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="section-container min-h-screen flex items-center justify-center px-6 py-20">
        <div className="container mx-auto max-w-7xl space-y-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 backdrop-blur">
              <Sparkles className="w-5 h-5 text-green-400" />
              <span className="text-xs font-semibold text-green-300 tracking-[0.18em] uppercase">
                Capacidades IA
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold">
              <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Módulos operativos de la consola
              </span>
            </h2>
            <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto">
              Cada característica se comporta como un módulo activable, con
              telemetría propia y rol definido dentro del flujo de tickets.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className={`group relative backdrop-blur ${feature.bgGlow} p-6 rounded-3xl border border-white/15`}
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`relative w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {feature.title}
                        </h3>
                        <p className="text-[11px] text-slate-300">
                          Módulo activo dentro del flujo de soporte.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-semibold text-emerald-200">
                        ON · Estable
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {feature.badge}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)] gap-4 text-sm">
                    <p className="text-slate-100 leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="space-y-2 text-xs text-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">
                          Uptime módulo
                        </span>
                        <span className="font-semibold text-emerald-300">
                          {feature.uptime}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-900 overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${feature.gradient}`}
                          style={{ width: feature.uptimeWidth }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">
                          Latencia promedio
                        </span>
                        <span className="font-semibold text-sky-300">
                          {feature.latency}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-900 overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${feature.gradient}`}
                          style={{ width: feature.latencyWidth }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col items-center gap-8 mt-4">
            <div className="relative inline-block backdrop-blur bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 p-8 rounded-3xl border border-blue-500/30 max-w-2xl w-full">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm text-slate-200 mb-1">
                      Desarrollado por {" "}
                      <span className="font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Diego Malpartida
                      </span>
                    </p>
                    <p className="text-sm text-blue-200 font-medium flex items-center gap-2">
                      <span>Instituto SENATI · Perú 2025</span>
                      <svg
                        className="w-6 h-4 rounded"
                        viewBox="0 0 900 600"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect width="900" height="600" fill="#D91023" />
                        <rect x="300" width="300" height="600" fill="#FFFFFF" />
                      </svg>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2">
                  <span className="px-3 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/25 text-blue-300 text-[11px] font-semibold flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Ingeniería de Software con IA
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-green-500/15 border border-green-500/25 text-green-300 text-[11px] font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Proyecto de Tesis
                  </span>
                </div>
              </div>
            </div>

            <Button
              onClick={onStartLogin}
              size="lg"
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-semibold text-lg px-12 py-6 rounded-2xl shadow"
            >
              <Sparkles className="w-6 h-6 mr-3" />
              <span>Iniciar sistema</span>
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </div>
        </div>
      </section>

      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-3">
        {sections.map((section, index) => (
          <div key={index} className="relative group">
            <button
              onClick={() => scrollToSection(index)}
              className={`w-4 h-4 rounded-full transition-all
                ${
                  activeSection === index
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 w-5 h-5 shadow"
                    : "bg-white/30 hover:bg-white/50"
                }`}
              aria-label={`Ir a sección ${index + 1}`}
            />
            <span className="absolute right-8 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900/90 backdrop-blur border border-white/15 rounded text-xs text-white font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
              {section}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
