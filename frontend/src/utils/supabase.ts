import { createClient } from '@supabase/supabase-js';
import brain from "brain";

// Variables para almacenar la configuración de Supabase
let supabaseClient: ReturnType<typeof createClient> | null = null;
let isInitialized = false;

// Datos de prueba para demostrar la funcionalidad
const MOCK_USER_ID = "123e4567-e89b-12d3-a456-426614174000";

const MOCK_USER_PROFILE: UserProfile = {
  id: "1",
  user_id: MOCK_USER_ID,
  full_name: "NexusForge User",
  email: "user@nexusforge.io",
  avatar_url: "https://i.pravatar.cc/150?u=nexusforge",
  updated_at: new Date().toISOString()
};

// Función para inicializar el cliente de Supabase
export async function initSupabase() {
  if (isInitialized) return supabaseClient;
  
  try {
    // Obtener la configuración del backend
    const response = await brain.get_supabase_config();
    const config = await response.json();
    
    // Crear el cliente con la configuración obtenida
    supabaseClient = createClient(config.url, config.anon_key);
    isInitialized = true;
    
    return supabaseClient;
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
    throw new Error('Failed to initialize Supabase client');
  }
}

// Función para obtener el cliente de Supabase (inicializándolo si es necesario)
export async function getSupabase() {
  if (!isInitialized) {
    await initSupabase();
  }
  return supabaseClient;
}

// Interfaces para tipos de usuarios y perfiles
export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url: string;
  email: string;
  updated_at: string;
}

// Función para obtener el perfil del usuario actual
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    // NOTA: En modo de desarrollo, devolvemos un perfil de prueba
    // En un entorno real, esto se conectaría a Supabase
    
    // Descomentar el siguiente código y comentar el return para usar Supabase real
    /*
    const supabase = await getSupabase();
    if (!supabase) throw new Error('Supabase client not initialized');
    
    // Obtener el usuario actualmente autenticado
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }
    
    // Buscar el perfil del usuario en la tabla de perfiles
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
      
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    return profile;
    */
    
    return MOCK_USER_PROFILE;
  } catch (error) {
    console.error('Error in getCurrentUserProfile:', error);
    return null;
  }
}

// Función para actualizar el perfil del usuario
export async function updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> {
  try {
    // NOTA: En modo de desarrollo, actualizamos el perfil de prueba
    // En un entorno real, esto se conectaría a Supabase
    
    // Descomentar el siguiente código y comentar el bloque de actualización local para usar Supabase real
    /*
    const supabase = await getSupabase();
    if (!supabase) throw new Error('Supabase client not initialized');
    
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId);
      
    if (error) {
      return { success: false, error: error.message };
    }
    */
    
    // Simular actualización local para demostrar la funcionalidad
    Object.assign(MOCK_USER_PROFILE, updates);
    console.log('Profile updated (mock):', MOCK_USER_PROFILE);
    
    return { success: true };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// Función para subir una imagen de avatar
export async function uploadAvatar(userId: string, file: File): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // NOTA: En modo de desarrollo, simulamos la subida de imágenes
    // En un entorno real, esto se conectaría a Supabase Storage
    
    // Descomentar el siguiente código y comentar la simulación para usar Supabase real
    /*
    const supabase = await getSupabase();
    if (!supabase) throw new Error('Supabase client not initialized');
    
    // Crear un nombre único para el archivo usando el ID del usuario
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/avatar.${fileExt}`;
    
    // Subir el archivo al bucket 'avatars'
    const { error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true });
      
    if (error) {
      return { success: false, error: error.message };
    }
    
    // Obtener la URL pública del archivo
    const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
    */
    
    // Simular una URL nueva basada en un timestamp para que sea única
    const mockUrl = `https://i.pravatar.cc/150?u=nexusforge-${Date.now()}`;
    
    // Actualizar el perfil del usuario con la nueva URL de avatar (local)
    MOCK_USER_PROFILE.avatar_url = mockUrl;
    MOCK_USER_PROFILE.updated_at = new Date().toISOString();
    
    console.log('Avatar updated (mock):', mockUrl);
    
    return { success: true, url: mockUrl };
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}