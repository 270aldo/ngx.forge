# Databutton app

This project consists of a FastAPI backend server and a React + TypeScript frontend application exported from Databutton.

## Stack

- React+Typescript frontend with `yarn` as package manager.
- Python FastAPI server with `uv` as package manager.

## Quickstart

1. Install dependencies:

```bash
make
```

2. Start the backend and frontend servers in separate terminals:

```bash
make run-backend
make run-frontend
```

## Variables de entorno

Antes de ejecutar la aplicación es necesario definir algunas variables de entorno:

- `JWT_SECRET`: clave utilizada para firmar los tokens generados por el backend.
- `SUPABASE_ANON_KEY`: clave anónima de Supabase que el backend expone al frontend.
- `DATABUTTON_PROJECT_ID`: opcional, identifica el proyecto Databutton para la compilación.
- `DATABUTTON_EXTENSIONS`: opcional, lista de extensiones Databutton en formato JSON.
- `DATABUTTON_SERVICE_TYPE`: define si el backend se ejecuta en modo `development` o `production`.

Estas variables pueden configurarse en un archivo `.env` o exportarse en la consola antes de lanzar los comandos de inicio.

## Ejecución

### Modo desarrollo

1. Instalar dependencias con `make`.
2. Exportar las variables de entorno necesarias.
3. Lanzar cada servicio en una terminal distinta:

```bash
make run-backend   # Inicia FastAPI con recarga automática
make run-frontend  # Arranca Vite en modo desarrollo
```

### Modo producción

1. Establecer las variables de entorno anteriores en el entorno de despliegue.
2. Construir la aplicación web:

```bash
cd frontend && yarn build
```

3. Ejecutar el backend con Uvicorn sin recarga automática:

```bash
cd backend && uvicorn main:app --host 0.0.0.0 --port 8000
```

4. Servir los archivos generados en `frontend/dist` con el servidor estático de tu elección o mediante `yarn preview` para una prueba local.

## Gotchas

The backend server runs on port 8000 and the frontend development server runs on port 5173. The frontend Vite server proxies API requests to the backend on port 8000.

Visit <http://localhost:5173> to view the application.

## Arquitectura

Para una descripción general de los módulos principales (Auth, Orchestrator, A2A
 y agentes especializados) consulta [docs/architecture.md](docs/architecture.md).
