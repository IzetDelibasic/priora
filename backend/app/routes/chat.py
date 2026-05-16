from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.agent.agent import get_agent_response

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    session_id: str = "default"


class ChatResponse(BaseModel):
    response: str
    session_id: str


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    try:
        response = await get_agent_response(
            message=request.message,
            session_id=request.session_id,
        )
        return ChatResponse(response=response, session_id=request.session_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent error: {str(e)}")
