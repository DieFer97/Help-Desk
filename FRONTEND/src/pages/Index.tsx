import { useState, useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import LoginPage from "@/components/LoginPage";
import ChatInterface from "@/components/ChatInterface";
import AdminDashboard from "@/components/AdminDashboard";

const Index = () => {
  const [currentView, setCurrentView] = useState<'loading' | 'login' | 'chat' | 'admin'>('loading');
  const [userType, setUserType] = useState<'user' | 'admin' | null>(null);

  const handleLoadingComplete = () => {
    setCurrentView('login');
  };

  const handleLogin = (type: 'user' | 'admin') => {
    setUserType(type);
    setCurrentView(type === 'user' ? 'chat' : 'admin');
  };

  const handleLogout = () => {
    setUserType(null);
    setCurrentView('login');
  };

  switch (currentView) {
    case 'loading':
      return <LoadingScreen onComplete={handleLoadingComplete} />;
    case 'login':
      return <LoginPage onLogin={handleLogin} />;
    case 'chat':
      return <ChatInterface onLogout={handleLogout} />;
    case 'admin':
      return <AdminDashboard onLogout={handleLogout} />;
    default:
      return <LoadingScreen onComplete={handleLoadingComplete} />;
  }
};

export default Index;
