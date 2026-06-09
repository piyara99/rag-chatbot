from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.rag_service import query_documents

router = APIRouter()

class QuestionRequest(BaseModel):
    question: str

@router.post("/ask")
async def ask(req: QuestionRequest):
    if not req.question.strip():
        raise HTTPException(400, "Question cannot be empty")
    try:
        result = query_documents(req.question)
        return result
    except Exception as e:
        raise HTTPException(500, f"Error: {str(e)}")
