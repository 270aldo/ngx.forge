import { ReactNode, useEffect } from "react";
import { useAuthStore } from "../utils/authStore";
import { initSupabase } from "../utils/supabase";
import { Toaster } from "sonner";

interface Props {
  children: ReactNode;
}

/**
 * A provider wrapping the whole app.
 *
 * You can add multiple providers here by nesting them,
 * and they will all be applied to the app.
 */
export const AppProvider = ({ children }: Props) => {
  const { initialize, isInitialized } = useAuthStore();
  
  // Inicializar Supabase y autenticación cuando se carga la aplicación
  useEffect(() => {
    const initAuth = async () => {
      if (isInitialized) return;
      
      try {
        // Inicializar cliente de Supabase
        await initSupabase();
        
        // Inicializar estado de autenticación
        await initialize();
        
        console.log("Authentication initialized successfully");
      } catch (error) {
        console.error("Failed to initialize authentication:", error);
      }
    };
    
    initAuth();
  }, [initialize, isInitialized]);
  
  return (
    <>
      {/* Add Material Icons for UI elements */}
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
      
      {/* Toaster for notifications */}
      <Toaster position="top-right" closeButton richColors />
      
      {children}
    </>
  );
};