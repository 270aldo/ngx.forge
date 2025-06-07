from fastapi import APIRouter, HTTPException, Depends, Header, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import databutton as db
import jwt
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, List

# Configuración para JWT
JWT_SECRET = db.secrets.get("JWT_SECRET", "nexusforge_default_secret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 1 semana

# Esquema de seguridad para autenticación Bearer
security = HTTPBearer()
router = APIRouter(prefix="/auth", tags=["auth"])


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    expires_in: int
    user_id: str


class UserData(BaseModel):
    user_id: str
    email: Optional[str] = None
    name: Optional[str] = None
    role: Optional[str] = None


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Crea un token JWT con los datos proporcionados"""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)
    return encoded_jwt


def decode_token(token: str) -> dict:
    """Decodifica un token JWT y devuelve los datos"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        return payload
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=401,
            detail="Token inválido",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Valida el token JWT y devuelve los datos del usuario"""
    token = credentials.credentials
    user_data = decode_token(token)
    return user_data


@router.get("/verify-token")
async def verify_token(current_user: dict = Depends(get_current_user)) -> UserData:
    """Verifica si el token JWT es válido y devuelve los datos del usuario"""
    return UserData(
        user_id=current_user.get("sub"),
        email=current_user.get("email"),
        name=current_user.get("name"),
        role=current_user.get("role")
    )


@router.post("/validate-supabase-token")
async def validate_supabase_token(request: Request) -> TokenResponse:
    """Valida un token de Supabase y genera un token JWT interno"""
    try:
        # Obtener el token de Authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Token no proporcionado")
        
        # Extraer el token
        supabase_token = auth_header.replace("Bearer ", "")
        
        # Aquí deberíamos validar el token con Supabase
        # Por ahora, simplemente decodificamos el JWT para obtener la información del usuario
        # En una implementación real, deberíamos verificar con Supabase
        try:
            # Nota: Esto es solo para extraer los datos, no para validar el token
            # La validación real se haría con la API de Supabase
            decoded = jwt.decode(supabase_token, options={"verify_signature": False})
            user_id = decoded.get("sub")
            
            if not user_id:
                raise ValueError("Token no contiene ID de usuario")
                
            # Crear nuestro propio token JWT interno
            token_data = {
                "sub": user_id,
                "email": decoded.get("email"),
                "name": decoded.get("name", "Usuario"),
                "role": "user"  # Asignar rol por defecto
            }
            
            # Definir tiempo de expiración
            expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            
            # Crear token
            access_token = create_access_token(
                data=token_data,
                expires_delta=expires_delta
            )
            
            return TokenResponse(
                access_token=access_token,
                token_type="bearer",
                expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,  # En segundos
                user_id=user_id
            )
            
        except Exception as e:
            raise HTTPException(
                status_code=401,
                detail=f"Token de Supabase inválido: {str(e)}"
            )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al validar token: {str(e)}"
        )
