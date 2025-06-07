# Arquitectura de NexusForge

La plataforma se compone de un backend en **FastAPI** y un frontend en **React**. El backend expone varios módulos que se comunican mediante peticiones HTTP y almacenamiento compartido. A continuación se describe el flujo principal entre los módulos.

```
[Frontend]
    |
    v
[Auth] <-- validación de tokens y emisión de JWT
    |
    v
[Orchestrator] --(mensajes A2A)--> [Agentes especializados]
    |
    v
[Frontend]
```

- **Auth**: gestiona la validación de tokens externos (por ejemplo, de Supabase) y genera tokens internos JWT para el resto de endpoints.
- **Orchestrator**: es el agente maestro. Recibe las consultas de los usuarios y decide a qué agente especializado dirigirlas. Mantiene contexto de sesión y registra el agente usado.
- **A2A (Agent to Agent)**: define un protocolo de mensajería entre agentes. Permite almacenar conversaciones, histórico y metadatos para cada interacción.
- **Agentes especializados**: módulos futuros que implementarán la lógica para entrenamiento, nutrición, recuperación, etc. Actualmente el orquestador simula sus respuestas.
- **Config**: expone la configuración necesaria para el frontend, como las credenciales de Supabase.

El objetivo final de **NexusForge** es ofrecer una plataforma SaaS con IA que integre diversos agentes expertos (entrenamiento, nutrición, biometría, entre otros) coordinados por un orquestador. Esto permitirá a los usuarios recibir planes y recomendaciones personalizadas desde una única interfaz.
