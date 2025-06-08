from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, Optional, List, Union
import uuid
from datetime import datetime
import databutton as db
from app.apis.auth import get_current_user

router = APIRouter(prefix="/a2a", tags=["a2a"])

class AgentInfo(BaseModel):
    agent_id: str
    agent_name: Optional[str] = None

class A2AMessage(BaseModel):
    message_id: Optional[str] = None
    conversation_id: Optional[str] = None
    from_agent: AgentInfo
    to_agent: AgentInfo
    message_type: str
    content: Dict[str, Any]
    metadata: Optional[Dict[str, Any]] = None

class A2AResponse(BaseModel):
    message_id: str
    conversation_id: str
    timestamp: str
    status: str
    message: str

class ConversationResponse(BaseModel):
    conversation_id: str
    messages: List[Dict[str, Any]]
    metadata: Dict[str, Any]

def _sanitize_key(key: str) -> str:
    """Sanitiza la clave para almacenamiento seguro"""
    return ''.join(c for c in key if c.isalnum() or c in '._-')

@router.post("/send")
async def send_message(message: A2AMessage, current_user: dict = Depends(get_current_user)) -> A2AResponse:
    """Envía un mensaje entre agentes utilizando el protocolo A2A"""
    try:
        # Generar IDs si no se proporcionan
        message_id = message.message_id or str(uuid.uuid4())
        conversation_id = message.conversation_id or str(uuid.uuid4())
        timestamp = datetime.utcnow().isoformat()
        
        # Formatear el mensaje en formato A2A
        a2a_message = {
            "message_id": message_id,
            "conversation_id": conversation_id,
            "timestamp": timestamp,
            "from": {
                "agent_id": message.from_agent.agent_id,
                "agent_name": message.from_agent.agent_name or "Unknown Agent"
            },
            "to": {
                "agent_id": message.to_agent.agent_id,
                "agent_name": message.to_agent.agent_name or "Unknown Agent"
            },
            "type": message.message_type,
            "content": message.content
        }
        
        if message.metadata:
            a2a_message["metadata"] = message.metadata
        
        # Almacenar el mensaje en el contexto de la conversación
        context_key = f"a2a_conversation_{conversation_id}"
        sanitized_key = _sanitize_key(context_key)
        
        try:
            context = db.storage.json.get(sanitized_key, {})
        except FileNotFoundError:
            context = {
                "conversation_id": conversation_id,
                "messages": [],
                "metadata": {}
            }
        
        # Agregar el mensaje al historial
        context["messages"].append(a2a_message)
        
        # Actualizar metadata si está presente
        if message.metadata:
            context["metadata"].update(message.metadata)
        
        # Guardar el contexto actualizado
        db.storage.json.put(sanitized_key, context)
        
        # También agregamos el mensaje al contexto del agente receptor para facilitar la consulta
        agent_context_key = f"a2a_agent_{message.to_agent.agent_id}"
        sanitized_agent_key = _sanitize_key(agent_context_key)
        
        try:
            agent_context = db.storage.json.get(sanitized_agent_key, {})
        except FileNotFoundError:
            agent_context = {}
        
        if conversation_id not in agent_context:
            agent_context[conversation_id] = {
                "messages": [],
                "metadata": {}
            }
        
        agent_context[conversation_id]["messages"].append(a2a_message)
        
        if message.metadata:
            if "metadata" not in agent_context[conversation_id]:
                agent_context[conversation_id]["metadata"] = {}
            agent_context[conversation_id]["metadata"].update(message.metadata)
        
        db.storage.json.put(sanitized_agent_key, agent_context)
        
        return A2AResponse(
            message_id=message_id,
            conversation_id=conversation_id,
            timestamp=timestamp,
            status="success",
            message="Mensaje enviado correctamente"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al enviar mensaje: {str(e)}")

@router.get("/conversation/{conversation_id}")
async def get_conversation(conversation_id: str, current_user: dict = Depends(get_current_user)) -> ConversationResponse:
    """Obtiene todos los mensajes de una conversación específica"""
    try:
        context_key = f"a2a_conversation_{conversation_id}"
        sanitized_key = _sanitize_key(context_key)
        
        try:
            context = db.storage.json.get(sanitized_key)
        except FileNotFoundError:
            raise HTTPException(status_code=404, detail=f"Conversación no encontrada: {conversation_id}")
        
        return ConversationResponse(
            conversation_id=conversation_id,
            messages=context.get("messages", []),
            metadata=context.get("metadata", {})
        )
        
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Error al obtener conversación: {str(e)}")

@router.get("/agent/{agent_id}/conversations")
async def get_agent_conversations(agent_id: str, current_user: dict = Depends(get_current_user)) -> Dict[str, Any]:
    """Obtiene todas las conversaciones de un agente específico"""
    try:
        agent_context_key = f"a2a_agent_{agent_id}"
        sanitized_key = _sanitize_key(agent_context_key)
        
        try:
            agent_context = db.storage.json.get(sanitized_key)
        except FileNotFoundError:
            return {"conversations": {}, "count": 0}
        
        return {
            "conversations": agent_context,
            "count": len(agent_context)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener conversaciones del agente: {str(e)}")
