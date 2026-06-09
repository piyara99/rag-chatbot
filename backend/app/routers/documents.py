from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from app.services.rag_service import (
    add_documents, extract_text_from_pdf,
    extract_text_from_url, extract_text_from_text, clear_documents
)

router = APIRouter()

class URLRequest(BaseModel):
    url: str

class TextRequest(BaseModel):
    text: str
    filename: str = "pasted_text.txt"

@router.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(400, "Only PDF files allowed")
    contents = await file.read()
    docs = extract_text_from_pdf(contents, file.filename)
    if not docs:
        raise HTTPException(400, "Could not extract text from PDF")
    chunks = add_documents(docs)
    return {"message": f"Added {file.filename}", "chunks": chunks}

@router.post("/add-url")
async def add_url(req: URLRequest):
    try:
        docs = extract_text_from_url(req.url)
        chunks = add_documents(docs)
        return {"message": f"Added {req.url}", "chunks": chunks}
    except Exception as e:
        raise HTTPException(400, f"Failed to fetch URL: {str(e)}")

@router.post("/add-text")
async def add_text(req: TextRequest):
    docs = extract_text_from_text(req.text, req.filename)
    chunks = add_documents(docs)
    return {"message": f"Added text document", "chunks": chunks}

@router.delete("/clear")
async def clear():
    clear_documents()
    return {"message": "All documents cleared"}
