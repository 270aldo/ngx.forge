import React, { useState, useEffect } from "react";
import { getCurrentUserProfile, updateUserProfile, uploadAvatar, UserProfile, initSupabase } from "../utils/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "../utils/authStore";
import { ProtectedRoute } from "../components/ProtectedRoute";

export default function Profile() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: ""
  });
  
  const navigate = useNavigate();
  const { user, logout, isInitialized, initialize } = useAuthStore();
  
  useEffect(() => {
    // Cargar el perfil de usuario cuando se carga el componente
    const loadProfile = async () => {
      try {
        await initSupabase();
        await loadUserProfile();
      } catch (error) {
        console.error("Error initializing:", error);
        toast.error("Failed to connect to the database");
        setIsLoading(false);
      }
    };
    
    loadProfile();
  }, []);
  
  async function loadUserProfile() {
    setIsLoading(true);
    try {
      const userProfile = await getCurrentUserProfile();
      
      if (userProfile) {
        setProfile(userProfile);
        setFormData({
          full_name: userProfile.full_name || "",
          email: userProfile.email || ""
        });
        console.log("Profile loaded successfully:", userProfile);
      } else {
        // En desarrollo, deberíamos tener siempre un perfil simulado
        console.error("No profile found");
        toast.error("No se pudo cargar el perfil de usuario");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Error al cargar el perfil de usuario");
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) return;
    
    setIsSaving(true);
    try {
      const { success, error } = await updateUserProfile(profile.user_id, {
        full_name: formData.full_name,
        // Solo actualizamos el nombre, ya que el email requiere verificación
        updated_at: new Date().toISOString()
      });
      
      if (success) {
        toast.success("Profile updated successfully");
        loadUserProfile(); // Recargar los datos para mostrar los cambios
      } else {
        toast.error(`Failed to update profile: ${error}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    
    setIsUploading(true);
    try {
      const { success, url, error } = await uploadAvatar(profile.user_id, file);
      
      if (success && url) {
        toast.success("Avatar updated successfully");
        // Actualizar el perfil local con la nueva URL de avatar
        setProfile(prev => prev ? { ...prev, avatar_url: url } : null);
      } else {
        toast.error(`Failed to update avatar: ${error}`);
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Has cerrado sesión exitosamente");
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Error al cerrar sesión");
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-5 hexagon-bg"></div>
        <div className="absolute top-0 left-1/4 w-1/2 h-64 bg-[#6D00FF] blur-[120px] opacity-10 pointer-events-none rounded-full"></div>
        <div className="absolute bottom-0 right-1/4 w-1/2 h-64 bg-[#6D00FF] blur-[120px] opacity-10 pointer-events-none rounded-full"></div>
      </div>
      
      {/* Header */}
      <header className="p-4 border-b border-[#333] relative z-10 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 mr-3 flex items-center justify-center rounded-md bg-[#222] hover:bg-[#333] text-gray-300 hover:text-white transition-colors"
          >
            <span className="material-icons-outlined text-sm">
              arrow_back
            </span>
          </button>
          <h1 className="text-xl font-medium">User Profile</h1>
        </div>
        
        <Button
          onClick={handleLogout}
          variant="outline"
          className="border-[#444] hover:bg-[#222] hover:text-white hover:border-[#6D00FF] transition-all flex items-center gap-2"
        >
          <span className="material-icons-outlined text-sm">logout</span>
          <span>Cerrar sesión</span>
        </Button>
      </header>
      
      <main className="container max-w-4xl mx-auto p-4 pt-8 relative z-10">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6">
            {/* Profile Card */}
            <Card className="border-[#333] bg-[#191919] shadow-lg">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and profile picture</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {isLoading ? (
                    <Skeleton className="h-24 w-24 rounded-full" />
                  ) : (
                    <div className="relative group">
                      <Avatar className="h-24 w-24 border-2 border-[#6D00FF33] shadow-[0_0_15px_rgba(109,0,255,0.3)]">
                        <AvatarImage src={profile?.avatar_url} />
                        <AvatarFallback className="bg-[#6D00FF33] text-white">
                          {profile?.full_name?.split(' ').map(name => name[0]).join('').toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      
                      {/* Upload overlay */}
                      <label 
                        htmlFor="avatar-upload"
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                      >
                        <span className="material-icons-outlined text-white">
                          photo_camera
                        </span>
                        <input 
                          type="file" 
                          id="avatar-upload" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleAvatarChange}
                          disabled={isUploading || !profile}
                        />
                      </label>
                      
                      {/* Loading overlay */}
                      {isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded-full">
                          <div className="h-6 w-6 border-2 border-t-transparent border-[#6D00FF] rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg font-medium">
                      {isLoading ? <Skeleton className="h-6 w-40" /> : (profile?.full_name || 'Your Name')}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {isLoading ? <Skeleton className="h-4 w-60 mt-1" /> : (profile?.email || 'your.email@example.com')}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {isLoading ? <Skeleton className="h-3 w-32" /> : (
                        <>Last updated: {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'Never'}</>
                      )}
                    </p>
                  </div>
                </div>
                
                {/* Form */}
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      {isLoading ? (
                        <Skeleton className="h-10 w-full" />
                      ) : (
                        <Input 
                          id="full_name"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleInputChange}
                          className="bg-[#222] border-[#333]"
                          disabled={isSaving || !profile}
                        />
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex justify-between">
                        <span>Email Address</span>
                        <span className="text-xs text-gray-400">(requires verification to change)</span>
                      </Label>
                      {isLoading ? (
                        <Skeleton className="h-10 w-full" />
                      ) : (
                        <Input 
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="bg-[#222] border-[#333]"
                          disabled={true} // Email requires verification to change
                        />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <Button 
                      type="submit" 
                      disabled={isLoading || isSaving || !profile}
                      className="bg-gradient-to-r from-[#6D00FF] to-[#8A2BE2] text-white shadow-md hover:shadow-lg transition-shadow relative overflow-hidden group"
                    >
                      {isSaving ? (
                        <>
                          <span className="inline-block h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></span>
                          Saving...
                        </>
                      ) : "Save Changes"}
                      
                      {/* Hover effect */}
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#6D00FF] to-[#8A2BE2] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            {/* Security Card */}
            <Card className="border-[#333] bg-[#191919] shadow-lg">
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage your account security settings</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-[#222] rounded-md border border-[#333]">
                  <div>
                    <h3 className="font-medium">Password</h3>
                    <p className="text-sm text-gray-400">Change your account password</p>
                  </div>
                  <Button 
                    onClick={() => navigate("/reset-password")}
                    variant="outline"
                    className="border-[#444] hover:bg-[#222] hover:text-white hover:border-[#6D00FF] transition-all"
                  >
                    Update
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preferences" className="space-y-6">
            <Card className="border-[#333] bg-[#191919] shadow-lg">
              <CardHeader>
                <CardTitle>User Preferences</CardTitle>
                <CardDescription>Customize your experience with NGX systems</CardDescription>
              </CardHeader>
              
              <CardContent>
                <p className="text-center py-8 text-gray-400">
                  Preference settings will be available in a future update.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}