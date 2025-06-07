import { create } from 'zustand';
import { getSupabase } from './supabase';
import { type User } from '@supabase/supabase-js';
import { useEffect } from 'react';

// Definición del estado de autenticación
interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  isInitialized: boolean;
  
  // Acciones de autenticación
  initialize: () => Promise<void>;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (password: string) => Promise<{ success: boolean; error?: string }>;
}

// Creación del store utilizando Zustand
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  isInitialized: false,
  
  // Inicializa el store con el usuario actual (si existe)
  initialize: async () => {
    if (get().isInitialized) return;
    
    set({ isLoading: true, error: null });
    
    try {
      const supabase = await getSupabase();
      if (!supabase) throw new Error('Supabase client not initialized');
      
      // Obtener la sesión actual
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      // Establecer el usuario si existe una sesión
      if (session?.user) {
        set({ user: session.user });
      }
      
      // Configurar listener para cambios de autenticación
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event);
          set({ user: session?.user || null });
        }
      );
      
      set({ isInitialized: true });
      
      // Limpiar la suscripción cuando se desmonte el componente
      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ error: error as Error });
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Iniciar sesión con email y contraseña
  login: async (email, password, rememberMe = false) => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = await getSupabase();
      if (!supabase) throw new Error('Supabase client not initialized');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          // Si rememberMe está activado, la sesión durará más tiempo
          // de lo contrario, será una sesión temporal
          ...(rememberMe ? {} : { rememberMe: false })
        }
      });
      
      if (error) {
        set({ error });
        return { success: false, error: error.message };
      }
      
      set({ user: data.user });
      return { success: true };
    } catch (error) {
      const e = error as Error;
      set({ error: e });
      return { success: false, error: e.message };
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Registro con email y contraseña
  register: async (email, password, fullName) => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = await getSupabase();
      if (!supabase) throw new Error('Supabase client not initialized');
      
      // Crear usuario
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      
      if (error) {
        set({ error });
        return { success: false, error: error.message };
      }
      
      // Crear perfil de usuario si el registro fue exitoso
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: data.user.id,
            full_name: fullName,
            email: email,
            avatar_url: `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`,
          });
        
        if (profileError) {
          console.error('Error creating profile:', profileError);
          // No consideramos esto un error crítico, el usuario puede configurar su perfil más tarde
        }
        
        set({ user: data.user });
      }
      
      return { success: true };
    } catch (error) {
      const e = error as Error;
      set({ error: e });
      return { success: false, error: e.message };
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Cerrar sesión
  logout: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = await getSupabase();
      if (!supabase) throw new Error('Supabase client not initialized');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      set({ user: null });
    } catch (error) {
      console.error('Logout error:', error);
      set({ error: error as Error });
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Solicitar restablecimiento de contraseña
  resetPassword: async (email) => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = await getSupabase();
      if (!supabase) throw new Error('Supabase client not initialized');
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        set({ error });
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error) {
      const e = error as Error;
      set({ error: e });
      return { success: false, error: e.message };
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Actualizar contraseña (cuando el usuario ya está autenticado)
  updatePassword: async (password) => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = await getSupabase();
      if (!supabase) throw new Error('Supabase client not initialized');
      
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) {
        set({ error });
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error) {
      const e = error as Error;
      set({ error: e });
      return { success: false, error: e.message };
    } finally {
      set({ isLoading: false });
    }
  },
}));

// Hook personalizado para proteger rutas que requieren autenticación
export function useRequireAuth() {
  const { user, isInitialized, initialize } = useAuthStore();
  
  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);
  
  return {
    isAuthenticated: !!user,
    isLoading: !isInitialized,
    user,
  };
}
