import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../utils/authStore";

interface ProtectedRouteProps {
  children: ReactNode;
}

// Componente que protege rutas que requieren autenticación
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isInitialized, initialize, isLoading: authLoading } = useAuthStore();
  const [isLoading, setIsLoading] = useState(!isInitialized);
  const location = useLocation();
  
  useEffect(() => {
    const initAuth = async () => {
      if (!isInitialized) {
        try {
          await initialize();
        } catch (error) {
          console.error("Error initializing auth:", error);
        }
      }
      setIsLoading(false);
    };
    
    initAuth();
  }, [initialize, isInitialized]);
  
  // Mientras está cargando, mostrar un indicador o nada
  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-t-transparent border-[#6D00FF] rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Si no hay usuario autenticado, redirigir al login
  if (!user) {
    // Redirección al login, preservando la ruta actual para redirigir de vuelta después del login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // Si hay usuario autenticado, renderizar los hijos (la página protegida)
  return <>{children}</>;
};

