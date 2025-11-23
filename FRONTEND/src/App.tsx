"use client"
import LandingPage from "@/components/LandingPage"
import LoadingScreen from "@/components/LoadingScreen"
import LoginPage from "@/components/LoginPage"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AuthProvider, useAuth } from "@/contexts/AuthContext"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type React from "react"
import { useEffect, useState } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Index from "./pages/Index"
import NotFound from "./pages/NotFound"

const queryClient = new QueryClient()

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-background">
        <div className="text-center">
          <div className="animate-pulse-glow text-primary text-xl">Cargando...</div>
        </div>
      </div>
    )
  }

  return user ? <>{children}</> : <Navigate to="/" />
}

const AppContent = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'loading' | 'app'>('landing')
  const { user } = useAuth()

  useEffect(() => {
    const hasSeenLanding = sessionStorage.getItem("hasSeenLanding")
    
    if (user) {
      setCurrentView('app')
    } else if (hasSeenLanding === "true") {
      setCurrentView('app')
    } else {
      setCurrentView('landing')
    }
  }, [user])

  const handleStartLogin = () => {
    sessionStorage.setItem("hasSeenLanding", "true")
    setCurrentView('loading')
  }

  const handleLoadingComplete = () => {
    setCurrentView('app')
  }

  if (currentView === 'landing') {
    return <LandingPage onStartLogin={handleStartLogin} />
  }

  if (currentView === 'loading') {
    return <LoadingScreen onComplete={handleLoadingComplete} />
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App
