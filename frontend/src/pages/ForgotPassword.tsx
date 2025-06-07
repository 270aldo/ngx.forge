import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "../utils/authStore";
import { toast } from "sonner";
import { initSupabase } from "../utils/supabase";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { resetPassword, user, isLoading, initialize } = useAuthStore();
  
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [validationError, setValidationError] = useState("");
  
  // Inicializar autenticación y verificar si ya existe un usuario
  useEffect(() => {
    const initAuth = async () => {
      await initSupabase();
      await initialize();
      
      // Si el usuario ya está autenticado, redirigir al perfil
      if (user) {
        navigate("/profile");
      }
    };
    
    initAuth();
  }, [initialize, navigate, user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setValidationError("");
  };
  
  const validateEmail = () => {
    if (!email) {
      setValidationError("El email es requerido");
      return false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setValidationError("Ingresa un email válido");
      return false;
    }
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail()) return;
    
    setIsSubmitting(true);
    
    try {
      const { success, error } = await resetPassword(email);
      
      if (success) {
        setResetEmailSent(true);
        toast.success("Se ha enviado un correo para restablecer tu contraseña");
      } else {
        toast.error(error || "Error al enviar el correo de recuperación");
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("Se produjo un error al solicitar el restablecimiento de contraseña");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center p-4">
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-5 hexagon-bg"></div>
        <div className="absolute top-0 left-1/4 w-1/2 h-64 bg-[#6D00FF] blur-[120px] opacity-10 pointer-events-none rounded-full"></div>
        <div className="absolute bottom-0 right-1/4 w-1/2 h-64 bg-[#6D00FF] blur-[120px] opacity-10 pointer-events-none rounded-full"></div>
      </div>
      
      <div className="w-full max-w-md z-10">
        {/* Logo y Título */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6D00FF] to-[#8A2BE2]">
            NexusForge
          </h1>
          <p className="text-gray-400 mt-2">Sistema de Agentes NGX</p>
        </div>
        
        {/* Tarjeta de Recuperación de Contraseña */}
        <Card className="border-[#333] bg-[#191919] shadow-lg">
          <CardHeader>
            <CardTitle>Recuperar Contraseña</CardTitle>
            <CardDescription className="text-gray-400">
              {resetEmailSent
                ? "Revisa tu correo para continuar con el proceso de recuperación"
                : "Ingresa tu correo electrónico para restablecer tu contraseña"}
            </CardDescription>
          </CardHeader>
          
          {resetEmailSent ? (
            <CardContent className="pt-4">
              <div className="bg-[#222] p-4 rounded-md border border-[#333] mb-4">
                <h3 className="text-lg font-medium text-gray-200 mb-2">Correo enviado</h3>
                <p className="text-gray-400">
                  Hemos enviado un correo electrónico a <span className="text-white font-medium">{email}</span> con instrucciones para restablecer tu contraseña.
                </p>
                <p className="text-gray-400 mt-2">
                  Si no recibes el correo dentro de unos minutos, revisa tu carpeta de spam o intenta nuevamente.
                </p>
              </div>
              
              <Button
                type="button"
                onClick={() => setResetEmailSent(false)}
                variant="outline"
                className="w-full border-[#444] hover:bg-[#222] hover:text-white hover:border-[#6D00FF] transition-all"
              >
                Intentar con otro correo
              </Button>
            </CardContent>
          ) : (
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={handleInputChange}
                    className="bg-[#222] border-[#333]"
                    disabled={isSubmitting}
                  />
                  {validationError && (
                    <p className="text-red-500 text-xs mt-1">{validationError}</p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting || isLoading}
                  className="w-full bg-gradient-to-r from-[#6D00FF] to-[#8A2BE2] text-white shadow-md hover:shadow-lg transition-shadow relative overflow-hidden group"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                      <span>Enviando...</span>
                    </div>
                  ) : (
                    <span>Enviar correo de recuperación</span>
                  )}
                  
                  {/* Hover effect */}
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#6D00FF] to-[#8A2BE2] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Button>
              </form>
            </CardContent>
          )}
          
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center w-full">
              <a 
                href="/login"
                className="text-sm text-[#6D00FF] hover:text-[#8A2BE2] transition-colors"
              >
                Volver a iniciar sesión
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
