import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-background">
      <div className="text-center animate-fade-in-up">
        <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-primary p-6 shadow-glow">
          <div className="w-full h-full text-white text-4xl font-bold flex items-center justify-center">
            404
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gradient">Página no encontrada</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Lo sentimos, la página que buscas no existe.
        </p>
        <a 
          href="/" 
          className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-primary text-white font-medium hover:opacity-90 transition-opacity"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  );
};

export default NotFound;
