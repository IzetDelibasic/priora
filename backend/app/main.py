from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import chat, health, triage

app = FastAPI(
    title="Priora AI Agent API",
    description="Backend for AI agent - competition project",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api", tags=["Health"])
app.include_router(chat.router, prefix="/api", tags=["Chat"])
app.include_router(triage.router, prefix="/api", tags=["Triage"])
