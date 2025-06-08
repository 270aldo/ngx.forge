from fastapi import APIRouter, HTTPException, Depends, Request, Query
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List, Union
import uuid
from datetime import datetime
import databutton as db
from app.apis.auth import get_current_user
from app.apis.a2a import A2AMessage, AgentInfo

router = APIRouter(prefix="/orchestrator", tags=["orchestrator"])

# Definición de modelos para las solicitudes y respuestas
class AgentRequest(BaseModel):
    query: str
    user_id: Optional[str] = None
    context: Optional[Dict[str, Any]] = None
    session_id: Optional[str] = None

class AgentResponse(BaseModel):
    request_id: str
    response: Dict[str, Any]
    agent_id: str = "orchestrator"
    agent_name: str = "Master Agent Orchestrator"
    timestamp: str
    session_id: Optional[str] = None

class AgentStatus(BaseModel):
    agent_id: str
    agent_name: str
    status: str
    last_active: Optional[str] = None
    description: str

class AllAgentsStatus(BaseModel):
    agents: List[AgentStatus]
    timestamp: str

# Lista de agentes disponibles en el sistema
AVAILABLE_AGENTS = [
    {
        "agent_id": "orchestrator",
        "agent_name": "Master Agent Orchestrator",
        "description": "Agente maestro que coordina la comunicación entre todos los agentes"
    },
    {
        "agent_id": "training",
        "agent_name": "Elite Training Strategist",
        "description": "Especialista en diseño de planes de entrenamiento personalizados"
    },
    {
        "agent_id": "nutrition",
        "agent_name": "Precision Nutrition Architect",
        "description": "Experto en nutrición y planes alimenticios personalizados"
    },
    {
        "agent_id": "recovery",
        "agent_name": "Recovery & Corrective Specialist",
        "description": "Especialista en recuperación y corrección de problemas físicos"
    },
    {
        "agent_id": "cognitive",
        "agent_name": "Cognitive & Biohacking Strategist",
        "description": "Estratega en optimización cognitiva y biohacking"
    },
    {
        "agent_id": "motivation",
        "agent_name": "Motivation & Behavior Coach",
        "description": "Coach de motivación y comportamiento"
    },
    {
        "agent_id": "biometrics",
        "agent_name": "Biometrics Insight Engine",
        "description": "Motor de análisis de datos biométricos"
    },
    {
        "agent_id": "systems",
        "agent_name": "Systems Integration & Automation Ops",
        "description": "Operador de integración de sistemas y automatización"
    },
    {
        "agent_id": "community",
        "agent_name": "Community & Client-Success Liaison",
        "description": "Enlace de éxito del cliente y comunidad"
    },
    {
        "agent_id": "security",
        "agent_name": "Security & Compliance Guardian",
        "description": "Guardian de seguridad y cumplimiento"
    }
]

# Función para el enrutamiento de consultas a agentes específicos
def route_query_to_agent(query: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Determina qué agente debe manejar una consulta específica"""
    # Palabras clave para cada agente
    agent_keywords = {
        "training": ["entrenamiento", "ejercicio", "rutina", "series", "repeticiones", "pesas", "cardio", "fuerza"],
        "nutrition": ["nutrición", "comida", "dieta", "alimentación", "calorías", "macros", "proteínas"],
        "recovery": ["recuperación", "descanso", "lesión", "dolor", "estiramiento", "movilidad", "fisioterapia"],
        "cognitive": ["mente", "cognitivo", "mental", "focus", "concentración", "biohacking", "suplementos"],
        "motivation": ["motivación", "hábitos", "disciplina", "constancia", "objetivos", "metas"],
        "biometrics": ["datos", "métricas", "seguimiento", "progreso", "medidas", "peso", "grasa"],
        "systems": ["sistema", "integración", "automatización", "herramientas", "apps", "tecnología"],
        "community": ["comunidad", "grupo", "social", "compañeros", "coach", "apoyo"],
        "security": ["seguridad", "privacidad", "datos personales", "protección", "normativa"]
    }
    
    # Contar coincidencias de palabras clave para cada agente
    agent_scores = {agent: 0 for agent in agent_keywords.keys()}
    
    query_lower = query.lower()
    for agent, keywords in agent_keywords.items():
        for keyword in keywords:
            if keyword.lower() in query_lower:
                agent_scores[agent] += 1
    
    # Si hay un agente con puntuación > 0, elegir el de mayor puntuación
    max_score = max(agent_scores.values()) if agent_scores else 0
    
    if max_score > 0:
        # En caso de empate, priorizar según el orden en AVAILABLE_AGENTS
        max_agents = [agent for agent, score in agent_scores.items() if score == max_score]
        
        if len(max_agents) == 1:
            selected_agent = max_agents[0]
        else:
            # Obtener el orden de los agentes empatados según AVAILABLE_AGENTS
            agent_order = [a["agent_id"] for a in AVAILABLE_AGENTS]
            ordered_max_agents = sorted(max_agents, key=lambda x: agent_order.index(x) if x in agent_order else float('inf'))
            selected_agent = ordered_max_agents[0]
    else:
        # Si no hay coincidencias claras, usar el contexto si existe
        if context and "last_agent" in context:
            selected_agent = context["last_agent"]
        else:
            # Por defecto, enviar al agente de entrenamiento
            selected_agent = "training"
    
    # Buscar el agente seleccionado en la lista de agentes disponibles
    agent_info = next((agent for agent in AVAILABLE_AGENTS if agent["agent_id"] == selected_agent), None)
    
    if not agent_info:
        # Si por alguna razón no se encuentra, usar el orquestador
        agent_info = AVAILABLE_AGENTS[0]  # El orquestador
    
    return agent_info

# Función para almacenar una sesión de usuario
def store_session(session_id: str, user_id: str, data: Dict[str, Any]):
    """Almacena o actualiza una sesión de usuario"""
    try:
        session_key = f"session_{user_id}_{session_id}"
        sanitized_key = ''.join(c for c in session_key if c.isalnum() or c in '._-')
        
        # Obtener la sesión existente o crear una nueva
        try:
            session = db.storage.json.get(sanitized_key, {})
        except FileNotFoundError:
            session = {}
        
        # Actualizar con los nuevos datos
        session.update(data)
        
        # Agregar timestamp de última actualización
        session["last_updated"] = datetime.utcnow().isoformat()
        
        # Guardar la sesión actualizada
        db.storage.json.put(sanitized_key, session)
        
        return True
    except Exception as e:
        print(f"Error al almacenar sesión: {str(e)}")
        return False

# Función para obtener una sesión de usuario
def get_session(session_id: str, user_id: str) -> Dict[str, Any]:
    """Obtiene una sesión de usuario"""
    try:
        session_key = f"session_{user_id}_{session_id}"
        sanitized_key = ''.join(c for c in session_key if c.isalnum() or c in '._-')
        
        try:
            session = db.storage.json.get(sanitized_key, {})
        except FileNotFoundError:
            session = {}
        
        return session
    except Exception as e:
        print(f"Error al obtener sesión: {str(e)}")
        return {}

# Endpoints de la API
@router.post("/query")
async def process_query(request: AgentRequest, current_user: dict = Depends(get_current_user)) -> AgentResponse:
    """Procesa una consulta de usuario y la dirige al agente adecuado"""
    try:
        # Generar ID de solicitud
        request_id = str(uuid.uuid4())
        timestamp = datetime.utcnow().isoformat()
        
        # Obtener ID de usuario (del token o del proporcionado en la solicitud)
        user_id = current_user.get("sub") or request.user_id
        if not user_id:
            raise HTTPException(status_code=400, detail="Se requiere ID de usuario")
        
        # Obtener o generar ID de sesión
        session_id = request.session_id or str(uuid.uuid4())
        
        # Obtener contexto de la sesión si existe
        session_context = get_session(session_id, user_id)
        
        # Combinar con el contexto proporcionado en la solicitud
        context = session_context
        if request.context:
            context.update(request.context)
        
        # Determinar qué agente debe manejar la consulta
        target_agent = route_query_to_agent(request.query, context)
        
        # Actualizar el contexto con el agente seleccionado
        context["last_agent"] = target_agent["agent_id"]
        context["last_query"] = request.query
        context["last_timestamp"] = timestamp
        
        # Almacenar la sesión actualizada
        store_session(session_id, user_id, context)
        
        # Aquí deberíamos enviar la consulta al agente específico
        # Por ahora, simulamos una respuesta
        
        # Respuesta simulada del agente
        agent_response = {
            "text": f"Tu consulta '{request.query}' ha sido dirigida al agente {target_agent['agent_name']}.",
            "agent": target_agent,
            "recommendations": [
                "Esta es una respuesta simulada. En una implementación real, recibirías respuesta del agente específico."
            ],
            "next_steps": [
                "Continuar el desarrollo de la API para el agente " + target_agent["agent_id"]
            ]
        }
        
        return AgentResponse(
            request_id=request_id,
            response=agent_response,
            agent_id="orchestrator",
            agent_name="Master Agent Orchestrator",
            timestamp=timestamp,
            session_id=session_id
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al procesar la consulta: {str(e)}")

@router.get("/agents/status")
async def get_agents_status(current_user: dict = Depends(get_current_user)) -> AllAgentsStatus:
    """Obtiene el estado de todos los agentes disponibles"""
    try:
        timestamp = datetime.utcnow().isoformat()
        
        # Por ahora, todos los agentes tienen el mismo estado
        agents_status = []
        for agent in AVAILABLE_AGENTS:
            # En una implementación real, deberíamos verificar el estado real de cada agente
            agents_status.append(AgentStatus(
                agent_id=agent["agent_id"],
                agent_name=agent["agent_name"],
                status="online",  # Simular que todos están en línea
                last_active=timestamp,
                description=agent["description"]
            ))
        
        return AllAgentsStatus(
            agents=agents_status,
            timestamp=timestamp
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener el estado de los agentes: {str(e)}")

@router.get("/agent/{agent_id}")
async def get_agent_info(agent_id: str, current_user: dict = Depends(get_current_user)) -> AgentStatus:
    """Obtiene información detallada de un agente específico"""
    try:
        # Buscar el agente en la lista de agentes disponibles
        agent_info = next((agent for agent in AVAILABLE_AGENTS if agent["agent_id"] == agent_id), None)
        
        if not agent_info:
            raise HTTPException(status_code=404, detail=f"Agente no encontrado: {agent_id}")
        
        timestamp = datetime.utcnow().isoformat()
        
        # En una implementación real, deberíamos verificar el estado real del agente
        return AgentStatus(
            agent_id=agent_info["agent_id"],
            agent_name=agent_info["agent_name"],
            status="online",  # Simular que está en línea
            last_active=timestamp,
            description=agent_info["description"]
        )
        
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Error al obtener información del agente: {str(e)}")

@router.post("/agent/{agent_id}/message")
async def send_message_to_agent(agent_id: str, message: A2AMessage, current_user: dict = Depends(get_current_user)) -> Dict[str, Any]:
    """Envía un mensaje a un agente específico"""
    try:
        # Verificar que el agente existe
        agent_info = next((agent for agent in AVAILABLE_AGENTS if agent["agent_id"] == agent_id), None)
        
        if not agent_info:
            raise HTTPException(status_code=404, detail=f"Agente no encontrado: {agent_id}")
        
        # Aquí deberíamos enviar el mensaje al agente específico
        # Por ahora, simulamos una respuesta
        
        # Generar IDs de mensaje y conversación si no se proporcionan
        message_id = message.message_id or str(uuid.uuid4())
        conversation_id = message.conversation_id or str(uuid.uuid4())
        timestamp = datetime.utcnow().isoformat()
        
        # Respuesta simulada
        return {
            "message_id": message_id,
            "conversation_id": conversation_id,
            "timestamp": timestamp,
            "status": "received",
            "message": f"Mensaje recibido por el agente {agent_info['agent_name']}. En una implementación real, se procesaría y se enviaría una respuesta."
        }
        
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Error al enviar mensaje al agente: {str(e)}")
