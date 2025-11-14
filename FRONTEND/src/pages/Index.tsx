import AdminDashboard from "@/components/AdminDashboard"
import ChatInterface from "@/components/ChatInterface"
import LoadingScreen from "@/components/LoadingScreen"
import { useAuth } from "@/contexts/AuthContext"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const Index = () => {
  const [showLoading, setShowLoading] = useState(true)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const hasSeenLoading = sessionStorage.getItem("hasSeenLoading")
    
    if (hasSeenLoading) {
      setShowLoading(false)
    }
  }, [])

  const handleLoadingComplete = () => {
    sessionStorage.setItem("hasSeenLoading", "true")
    setShowLoading(false)
  }

  const handleLogout = () => {
  logout()
  sessionStorage.clear()
  navigate("/")
}

  if (showLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />
  }

  if (!user) {
    navigate("/login")
    return null
  }

  const isAdmin = user.tipo_usuario === "admin"

  if (isAdmin) {
    return <AdminDashboard onLogout={handleLogout} />
  }

  return <ChatInterface onLogout={handleLogout} />
}

export default Index