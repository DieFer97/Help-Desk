import { Button } from "@/components/ui/button";
import { ArrowRight, Award, Brain, CheckCircle2, Layers, MessageSquare, Rocket, Sparkles, Star, TrendingUp, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { SiExpress, SiN8N, SiOllama, SiPostgresql, SiPrisma, SiReact, SiTypescript } from "react-icons/si";


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
    { 
      icon: SiOllama, 
      name: "Ollama AI", 
      description: "Modelos Llava y Qwen3", 
      bgColor: "bg-slate-500/10", 
      borderColor: "border-slate-500/30",
      iconColor: "text-slate-200"
    },
    { 
      icon: SiReact, 
      name: "React", 
      description: "Frontend moderno", 
      bgColor: "bg-cyan-500/10", 
      borderColor: "border-cyan-500/30",
      iconColor: "text-cyan-400"
    },
    { 
      icon: SiTypescript, 
      name: "TypeScript", 
      description: "Tipado estático", 
      bgColor: "bg-blue-500/10", 
      borderColor: "border-blue-500/30",
      iconColor: "text-blue-400"
    },
    { 
      icon: SiN8N, 
      name: "N8N Workflows", 
      description: "Automatización inteligente", 
      bgColor: "bg-pink-500/10", 
      borderColor: "border-pink-500/30",
      iconColor: "text-pink-400"
    },
    { 
      icon: SiPostgresql, 
      name: "PostgreSQL", 
      description: "Base de datos robusta", 
      bgColor: "bg-indigo-500/10", 
      borderColor: "border-indigo-500/30",
      iconColor: "text-indigo-400"
    },
    { 
      icon: SiPrisma, 
      name: "Prisma ORM", 
      description: "Gestión de datos", 
      bgColor: "bg-slate-500/10", 
      borderColor: "border-slate-500/30",
      iconColor: "text-slate-200"
    },
    { 
      icon: SiExpress, 
      name: "Express.js", 
      description: "Backend escalable", 
      bgColor: "bg-gray-500/10", 
      borderColor: "border-gray-500/30",
      iconColor: "text-gray-200"
    },
  ];


  const features = [
    {
      icon: MessageSquare,
      title: "Chatbot IA Conversacional",
      description: "Asistente virtual inteligente con procesamiento de lenguaje natural y memoria contextual.",
      gradient: "from-primary to-accent",
      bgGlow: "bg-blue-500/20",
      badge: "IA Avanzada"
    },
    {
      icon: Brain,
      title: "Análisis Multimodal",
      description: "Procesamiento de texto e imágenes con modelos de IA locales para diagnóstico de problemas.",
      gradient: "from-accent to-success",
      bgGlow: "bg-purple-500/20",
      badge: "Visión IA"
    },
    {
      icon: Zap,
      title: "Gestión Automática de Tickets",
      description: "Clasificación inteligente y escalamiento automático a soporte especializado.",
      gradient: "from-success to-warning",
      bgGlow: "bg-green-500/20",
      badge: "Automatizado"
    },
    {
      icon: Sparkles,
      title: "Respuestas Contextuales",
      description: "Sistema que aprende del historial de conversación para respuestas personalizadas.",
      gradient: "from-warning to-primary",
      bgGlow: "bg-yellow-500/20",
      badge: "Smart AI"
    },
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob [animation-delay:2s]"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob [animation-delay:4s]"></div>
        <div className="absolute bottom-0 right-20 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob [animation-delay:6s]"></div>
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>


      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-slate-950/70 border-b border-white/10 shadow-2xl">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-75 animate-pulse"></div>
              <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
                <Brain className="w-7 h-7 text-white animate-pulse" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                CISTCOR AI
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-xs text-green-400 font-medium">En línea</span>
              </div>
            </div>
          </div>


          <div className="hidden md:flex items-center space-x-1 bg-white/5 rounded-full p-1.5 backdrop-blur-xl border border-white/10">
            {['Inicio', 'Proyecto', 'Tecnologías', 'Características'].map((item, index) => (
              <button
                key={item}
                onClick={() => scrollToSection(index)}
                className={`px-5 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 ${
                  activeSection === index 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/50' 
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {item}
              </button>
            ))}
          </div>


          <Button 
            onClick={onStartLogin}
            className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold px-8 py-6 rounded-xl shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/80 transform hover:scale-105 transition-all duration-300 border-2 border-white/20"
          >
            <span className="relative z-10 flex items-center gap-2">
              Iniciar Sesión
              <ArrowRight className="w-4 h-4" />
            </span>
          </Button>
        </div>
      </nav>


      <section className={`section-container min-h-screen flex items-center justify-center pt-32 px-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="container mx-auto text-center z-10 max-w-6xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 backdrop-blur-xl mb-8 animate-bounce">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Proyecto de Tesis 2025
            </span>
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          </div>

          <div className="relative inline-block mb-10">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full opacity-30 blur-3xl animate-pulse"></div>
            <div className="relative w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 p-8 shadow-2xl transform hover:scale-110 hover:rotate-6 transition-all duration-500">
              <Rocket className="w-full h-full text-white drop-shadow-2xl" />
            </div>
          </div>


          <h1 className="text-7xl md:text-8xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
              Help Desk con IA
            </span>
          </h1>
          
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl"></div>
            <p className="relative text-2xl md:text-3xl text-white font-bold px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
              Sistema Inteligente de Soporte Técnico
            </p>
          </div>


          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Automatización avanzada con Inteligencia Artificial para transformar tu servicio de atención al cliente
          </p>


          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
            <Button 
              onClick={onStartLogin}
              size="lg"
              className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold text-xl px-12 py-8 rounded-2xl shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/80 transform hover:scale-110 transition-all duration-300 border-2 border-white/20"
            >
              <Sparkles className="w-6 h-6 mr-3 animate-spin" />
              Comenzar Ahora
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
            </Button>
            <Button 
              onClick={() => scrollToSection(1)}
              size="lg"
              variant="outline"
              className="text-xl px-12 py-8 rounded-2xl backdrop-blur-xl bg-white/5 border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40 transform hover:scale-105 transition-all duration-300 font-semibold"
            >
              Conocer Más
            </Button>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { label: "IA Local", value: "Ollama", icon: Brain, color: "from-blue-500 to-cyan-500", glow: "shadow-blue-500/50", width: "85%" },
              { label: "Respuestas", value: "< 2s", icon: Zap, color: "from-purple-500 to-pink-500", glow: "shadow-purple-500/50", width: "95%" },
              { label: "Precisión", value: "95%", icon: TrendingUp, color: "from-green-500 to-emerald-500", glow: "shadow-green-500/50", width: "90%" }
            ].map((stat, idx) => {
              const StatIcon = stat.icon;
              return (
                <div 
                  key={stat.label} 
                  className={`relative group backdrop-blur-2xl bg-white/5 p-8 rounded-3xl border-2 border-white/10 hover:border-white/30 transition-all duration-500 hover:scale-105 hover:-translate-y-2 shadow-2xl ${stat.glow} hover:shadow-3xl`}
                >
                  <div className={`absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-2xl ${stat.glow} transform rotate-12 group-hover:rotate-45 transition-transform duration-500`}>
                    <StatIcon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="text-5xl font-black mb-3">
                    <span className={`bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                      {stat.value}
                    </span>
                  </div>
                  <div className="text-lg font-bold text-slate-300">{stat.label}</div>
                  
                  <div className="mt-4 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${stat.color} rounded-full animate-pulse w-[${stat.width}]`}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      <section className="section-container min-h-screen flex items-center justify-center px-6 py-20">
        <div className="container mx-auto z-10 max-w-7xl">
          <div className="text-center mb-20 relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 backdrop-blur-xl mb-6">
              <Award className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-bold text-blue-400">PROYECTO DE TESIS</span>
            </div>
            
            <h2 className="text-6xl md:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Sobre el Proyecto
              </span>
            </h2>
            <p className="text-2xl text-slate-300 font-semibold">Innovación en soporte técnico empresarial</p>
            
            <div className="flex items-center justify-center gap-3 mt-8">
              <div className="h-1 w-20 bg-gradient-to-r from-transparent via-blue-500 to-blue-500 rounded-full"></div>
              <Sparkles className="w-6 h-6 text-blue-400" />
              <div className="h-1 w-20 bg-gradient-to-l from-transparent via-purple-500 to-purple-500 rounded-full"></div>
            </div>
          </div>


          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="group relative backdrop-blur-2xl bg-gradient-to-br from-red-500/10 to-orange-500/10 p-10 rounded-3xl border-2 border-red-500/30 hover:border-red-500/50 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 shadow-2xl shadow-red-500/20">
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-500/50 transform -rotate-12 group-hover:rotate-0 transition-transform duration-500 border-4 border-slate-950">
                <span className="text-3xl font-black text-white">01</span>
              </div>
              
              <div className="flex items-center gap-4 mb-6 mt-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 p-4 shadow-2xl shadow-red-500/50 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Brain className="w-full h-full text-white" />
                </div>
                <h3 className="text-3xl font-black text-white">Problemática</h3>
              </div>
              
              <p className="text-lg text-slate-200 leading-relaxed">
                Las empresas enfrentan <span className="font-bold text-red-400">altos tiempos de respuesta</span> en soporte técnico, <span className="font-bold text-orange-400">costos elevados</span> de personal, 
                y dificultad para escalar servicios durante picos de demanda. Los sistemas tradicionales carecen de 
                inteligencia contextual y capacidad de análisis visual.
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                <span className="px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-sm font-bold">⏱️ Respuesta lenta</span>
                <span className="px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 text-sm font-bold">💰 Costos altos</span>
              </div>
            </div>


            <div className="group relative backdrop-blur-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-10 rounded-3xl border-2 border-green-500/30 hover:border-green-500/50 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 shadow-2xl shadow-green-500/20">
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-green-500/50 transform rotate-12 group-hover:rotate-0 transition-transform duration-500 border-4 border-slate-950">
                <span className="text-3xl font-black text-white">02</span>
              </div>
              
              <div className="flex items-center gap-4 mb-6 mt-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 p-4 shadow-2xl shadow-green-500/50 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Zap className="w-full h-full text-white" />
                </div>
                <h3 className="text-3xl font-black text-white">Solución</h3>
              </div>
              
              <p className="text-lg text-slate-200 leading-relaxed">
                Sistema Help Desk con IA que combina <span className="font-bold text-green-400">procesamiento de lenguaje natural</span>, análisis de imágenes, 
                clasificación inteligente de consultas, y gestión automática de tickets. Reduce tiempos de respuesta 
                en un <span className="font-bold text-emerald-400 text-2xl">70%</span> y mejora la satisfacción del cliente.
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                <span className="px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 text-green-300 text-sm font-bold">✨ IA Avanzada</span>
                <span className="px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm font-bold">🚀 70% más rápido</span>
              </div>
            </div>
          </div>


          <div className="group relative backdrop-blur-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 p-10 rounded-3xl border-2 border-blue-500/30 hover:border-blue-500/50 transition-all duration-500 shadow-2xl shadow-blue-500/20">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/50 border-4 border-slate-950 transform group-hover:scale-110 transition-transform duration-500">
              <span className="text-3xl font-black text-white">03</span>
            </div>
            
            <div className="flex items-center justify-center gap-4 mb-8 mt-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4 shadow-2xl shadow-purple-500/50 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <Layers className="w-full h-full text-white" />
              </div>
              <h3 className="text-3xl font-black text-white">Objetivos del Proyecto</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="backdrop-blur-xl bg-white/5 p-8 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                  <h4 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Objetivo General
                  </h4>
                </div>
                <p className="text-lg text-slate-200 leading-relaxed">
                  Desarrollar e implementar un sistema Help Desk inteligente con capacidades de IA multimodal 
                  para CISTCOR, automatizando la atención al cliente y optimizando la gestión de tickets de soporte.
                </p>
              </div>
              
              <div className="backdrop-blur-xl bg-white/5 p-8 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse [animation-delay:0.5s]"></div>
                  <h4 className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Objetivos Específicos
                  </h4>
                </div>
                <ul className="space-y-3">
                  {[
                    "Implementar chatbot conversacional con IA local",
                    "Integrar análisis de imágenes para diagnóstico visual",
                    "Automatizar clasificación y escalamiento de tickets",
                    "Reducir tiempos de respuesta y costos operativos"
                  ].map((objetivo, idx) => (
                    <li key={idx} className="flex items-start gap-3 group/item hover:translate-x-2 transition-transform duration-300">
                      <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-lg text-slate-200">{objetivo}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="section-container min-h-screen flex items-center justify-center px-6 py-20">
        <div className="container mx-auto z-10 max-w-7xl">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 backdrop-blur-xl mb-6">
              <SiReact className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-bold text-purple-400">TECNOLOGÍAS</span>
            </div>
            
            <h2 className="text-6xl md:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Stack Tecnológico
              </span>
            </h2>
            <p className="text-2xl text-slate-300 font-semibold">Herramientas de vanguardia para soluciones innovadoras</p>
          </div>


          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 [&>*:last-child:nth-child(3n+1)]:lg:col-start-2">
            {technologies.map((tech, index) => {
              const Icon = tech.icon;
              return (
                <div 
                  key={tech.name}
                  className={`group relative backdrop-blur-2xl ${tech.bgColor} p-8 rounded-3xl border-2 ${tech.borderColor} hover:border-opacity-60 transition-all duration-500 hover:scale-105 hover:-translate-y-3 shadow-2xl cursor-pointer overflow-hidden`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg transform rotate-12 group-hover:rotate-45 transition-transform duration-500">
                    <Star className="w-4 h-4 text-white fill-white" />
                  </div>
                  
                  <div className={`relative w-20 h-20 rounded-2xl bg-slate-900/50 backdrop-blur-sm p-5 mb-6 shadow-2xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 border border-white/10`}>
                    <Icon className={`w-full h-full ${tech.iconColor}`} />
                  </div>
                  
                  <h3 className="relative text-2xl font-black text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                    {tech.name}
                  </h3>
                  <p className="relative text-base text-slate-300 font-medium">{tech.description}</p>
                  
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              );
            })}
          </div>


          <div className="relative backdrop-blur-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-12 rounded-3xl border-2 border-indigo-500/30 hover:border-indigo-500/50 transition-all duration-500 shadow-2xl shadow-indigo-500/20 overflow-hidden group">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500 rounded-full opacity-20 blur-3xl group-hover:opacity-30 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <h3 className="text-4xl font-black text-center mb-12">
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Arquitectura del Sistema
                </span>
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { num: "01", color: "from-cyan-500 to-blue-500", title: "Frontend React + TypeScript", desc: "Interfaz moderna con Tailwind CSS y Shadcn UI", icon: SiReact, iconColor: "text-cyan-400" },
                  { num: "02", color: "from-gray-500 to-slate-500", title: "Backend Express.js + Prisma", desc: "API RESTful con autenticación JWT y gestión de datos", icon: SiExpress, iconColor: "text-gray-200" },
                  { num: "03", color: "from-pink-500 to-rose-500", title: "N8N Automation Workflows", desc: "Orquestación de IA, webhooks y procesamiento multimodal", icon: SiN8N, iconColor: "text-pink-400" },
                  { num: "04", color: "from-slate-500 to-gray-600", title: "Ollama AI Local Models", desc: "Llava 7b para imágenes, Qwen3-coder para texto", icon: SiOllama, iconColor: "text-slate-200" }
                ].map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <div key={item.num} className="flex items-start gap-5 p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group/item">
                      <div className={`flex-shrink-0 w-16 h-16 rounded-xl bg-slate-900/50 backdrop-blur-sm flex items-center justify-center shadow-2xl transform group-hover/item:scale-110 group-hover/item:rotate-6 transition-all duration-300 relative border border-white/10`}>
                        <ItemIcon className={`w-8 h-8 ${item.iconColor} absolute`} />
                        <span className="absolute -top-2 -right-2 w-7 h-7 bg-slate-950 rounded-lg flex items-center justify-center text-xs font-black text-white border-2 border-white/20">
                          {item.num}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-black text-white mb-2 group-hover/item:text-transparent group-hover/item:bg-gradient-to-r group-hover/item:from-blue-400 group-hover/item:to-purple-400 group-hover/item:bg-clip-text transition-all duration-300">
                          {item.title}
                        </h4>
                        <p className="text-sm text-slate-300 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="section-container min-h-screen flex items-center justify-center px-6 py-20">
        <div className="container mx-auto z-10 max-w-7xl">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 backdrop-blur-xl mb-6">
              <Sparkles className="w-5 h-5 text-green-400" />
              <span className="text-sm font-bold text-green-400">CARACTERÍSTICAS</span>
            </div>
            
            <h2 className="text-6xl md:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Características Principales
              </span>
            </h2>
            <p className="text-2xl text-slate-300 font-semibold">Funcionalidades que transforman el soporte técnico</p>
          </div>


          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={feature.title}
                  className={`group relative backdrop-blur-2xl ${feature.bgGlow} p-10 rounded-3xl border-2 border-white/20 hover:border-white/40 transition-all duration-700 hover:scale-[1.02] hover:-translate-y-3 shadow-2xl cursor-pointer overflow-hidden`}
                >
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000"></div>
                  
                  <div className="absolute top-6 right-6 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-400/30 backdrop-blur-xl">
                    <span className="text-xs font-black text-yellow-300">{feature.badge}</span>
                  </div>
                  
                  <div className="relative mb-8">
                    <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500`}></div>
                    <div className={`relative w-24 h-24 rounded-3xl bg-gradient-to-br ${feature.gradient} p-6 shadow-2xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                      <Icon className="w-full h-full text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-black text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-slate-200 leading-relaxed">{feature.description}</p>
                  
                  <div className="mt-6 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${feature.gradient} rounded-full w-0 group-hover:w-full transition-all duration-1000`}></div>
                  </div>
                </div>
              );
            })}
          </div>


          <div className="text-center">
            <div className="relative inline-block backdrop-blur-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 p-12 rounded-3xl border-2 border-blue-500/30 hover:border-blue-500/50 mb-12 transition-all duration-500 shadow-2xl shadow-blue-500/20 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/10 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <p className="text-xl text-slate-200 mb-8 font-medium">
                  Proyecto desarrollado por <span className="font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Diego Malpartida</span>
                </p>
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-75 animate-pulse"></div>
                    <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <Brain className="w-9 h-9 text-white" />
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-black text-white">Instituto SENATI</p>
                    <p className="text-lg text-blue-400 font-bold flex items-center gap-2">
                    <span>Perú - 2025</span>
                    <svg className="w-6 h-4" viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
                      <rect width="900" height="600" fill="#D91023"/>
                      <rect x="300" width="300" height="600" fill="#FFFFFF"/>
                    </svg>
                  </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                  <span className="px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-bold flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Ingeniería de Software con IA
                  </span>
                  <span className="px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 text-green-300 text-sm font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Proyecto de Tesis
                  </span>
                </div>
              </div>
            </div>


            <Button 
              onClick={onStartLogin}
              size="lg"
              className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white font-black text-2xl px-16 py-10 rounded-2xl shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/80 transform hover:scale-110 hover:-translate-y-2 transition-all duration-500 border-4 border-white/20"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <Sparkles className="w-8 h-8 mr-4 relative z-10 animate-spin" />
              <span className="relative z-10">Iniciar Sistema</span>
              <ArrowRight className="w-8 h-8 ml-4 relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </section>


      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4">
        {['Inicio', 'Proyecto', 'Tecnologías', 'Características'].map((section, index) => (
          <div key={index} className="relative group">
            <button
              onClick={() => scrollToSection(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                activeSection === index 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 w-5 h-5 shadow-2xl shadow-purple-500/50 scale-125' 
                  : 'bg-white/30 hover:bg-white/50 hover:scale-125'
              }`}
              aria-label={`Ir a sección ${index + 1}`}
            />
            <span className="absolute right-8 top-1/2 -translate-y-1/2 px-4 py-2 bg-slate-900/90 backdrop-blur-xl border-2 border-white/20 rounded-xl text-sm text-white font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 shadow-2xl">
              {section}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};


export default LandingPage;