from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import databutton as db

router = APIRouter()


class SupabaseConfigResponse(BaseModel):
    url: str
    anon_key: str


@router.get("/supabase-config")
def get_supabase_config() -> SupabaseConfigResponse:
    """Obtiene la configuración de Supabase para el frontend"""
    try:
        # URL de Supabase proporcionada por el usuario
        supabase_url = os.getenv("SUPABASE_URL", "https://blrzviguanblulnxepnx.supabase.co")
        
        # Obtener la clave anónima desde los secretos
        supabase_anon_key = db.secrets.get("SUPABASE_ANON_KEY")
        
        if not supabase_anon_key:
            raise HTTPException(status_code=500, detail="Supabase Anon Key no está configurada")
        
        return SupabaseConfigResponse(
            url=supabase_url,
            anon_key=supabase_anon_key
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener la configuración de Supabase: {str(e)}")
