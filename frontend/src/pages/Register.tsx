import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "../utils/authStore";
import { toast } from "sonner";
import { initSupabase } from "../utils/supabase";

export default function Register() {
  const navigate = useNavigate();
  const { register, user, isLoading, initialize } = useAuthStore();
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
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
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar errores de validación cuando el usuario escribe
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      errors.fullName = "El nombre completo es requerido";
    }
    
    if (!formData.email) {
      errors.email = "El email es requerido";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Ingresa un email válido";
    }
    
    if (!formData.password) {
      errors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres";
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const { success, error } = await register(
        formData.email,
        formData.password,
        formData.fullName
      );
      
      if (success) {
        toast.success("Registro exitoso");
        navigate("/profile");
      } else {
        toast.error(error || "Error al registrar usuario");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Se produjo un error durante el registro");
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
        
        {/* Tarjeta de Registro */}
        <Card className="border-[#333] bg-[#191919] shadow-lg">
          <CardHeader>
            <CardTitle>Crear una cuenta</CardTitle>
            <CardDescription className="text-gray-400">
              Completa el formulario para registrarte en NexusForge
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre completo</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Tu nombre completo"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="bg-[#222] border-[#333]"
                  disabled={isSubmitting}
                />
                {validationErrors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.fullName}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-[#222] border-[#333]"
                  disabled={isSubmitting}
                />
                {validationErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-[#222] border-[#333]"
                  disabled={isSubmitting}
                />
                {validationErrors.password && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="bg-[#222] border-[#333]"
                  disabled={isSubmitting}
                />
                {validationErrors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.confirmPassword}</p>
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
                    <span>Registrando...</span>
                  </div>
                ) : (
                  <span>Crear cuenta</span>
                )}
                
                {/* Hover effect */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#6D00FF] to-[#8A2BE2] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center w-full">
              <span className="text-gray-400 text-sm">¿Ya tienes una cuenta?</span>{" "}
              <a 
                href="/login"
                className="text-sm text-[#6D00FF] hover:text-[#8A2BE2] transition-colors"
              >
                Inicia sesión aquí
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
