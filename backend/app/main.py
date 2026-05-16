from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import chat, health

app = FastAPI(
    title="Priora AI Agent API",
    description="Backend za AI agenta - takmičarski projekat",
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
