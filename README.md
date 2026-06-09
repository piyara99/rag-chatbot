# RAG Document Q&A Chatbot

A full-stack **Retrieval-Augmented Generation (RAG)** system that lets you upload documents and ask questions about them using Google Gemini AI. Built with FastAPI, LangChain, ChromaDB, and React.

![RAG Chatbot](https://img.shields.io/badge/AI-Gemini%201.5%20Flash-blue?style=flat-square)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-green?style=flat-square)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=flat-square)
![ChromaDB](https://img.shields.io/badge/VectorDB-ChromaDB-orange?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

## What It Does

Upload any document — a research paper, article, or notes — and ask natural language questions. The system retrieves the most relevant chunks from your documents and generates accurate answers with source citations.

```
User uploads PDF / URL / Text
        ↓
Documents chunked and embedded (ChromaDB)
        ↓
User asks a question
        ↓
Relevant chunks retrieved via semantic search
        ↓
Gemini generates answer with source citations
```

## Features

- **PDF Upload** — drag and drop any PDF file
- **Web URL** — paste any URL and scrape its content
- **Raw Text** — paste text directly into the system
- **Source Citations** — every answer shows which document and page it came from
- **Multi-document** — load multiple documents and query across all of them
- **Clear & Reset** — remove all documents and start fresh

## Tech Stack

| Layer | Technology |
|-------|-----------|
| LLM | Google Gemini 1.5 Flash |
| Embeddings | Google text-embedding-004 |
| Vector Store | ChromaDB |
| RAG Framework | LangChain |
| Backend | FastAPI + Python |
| PDF Parsing | PyPDF2 |
| Web Scraping | BeautifulSoup4 |
| Frontend | React + Vite |
| HTTP Client | Axios |

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- Google Gemini API key — free at [aistudio.google.com](https://aistudio.google.com)

### 1. Clone the repository

```bash
git clone https://github.com/piyara99/rag-chatbot.git
cd rag-chatbot
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv

# Windows (Git Bash)
source venv/Scripts/activate

# Mac / Linux
source venv/bin/activate

pip install -r requirements.txt
```

Create your `.env` file:

```bash
cp .env.example .env
```

Open `.env` and add your Gemini API key:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the backend:

```bash
uvicorn app.main:app --reload --port 8000
```

Backend runs at `http://localhost:8000`
API docs available at `http://localhost:8000/docs`

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

## Usage

1. Open `http://localhost:5173`
2. **Upload a document** — choose PDF, URL, or Text tab
3. Wait for the confirmation message showing chunk count
4. **Type your question** in the chat input
5. Get an AI-powered answer with source citations

## Project Structure

```
rag-chatbot/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app entry point
│   │   ├── routers/
│   │   │   ├── documents.py     # Document upload endpoints
│   │   │   └── chat.py          # Chat/question endpoint
│   │   └── services/
│   │       └── rag_service.py   # RAG pipeline logic
│   ├── .env.example
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── App.jsx
│       ├── App.css
│       └── components/
│           ├── DocumentUploader.jsx
│           └── ChatInterface.jsx
├── .gitignore
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/documents/upload-pdf` | Upload a PDF file |
| POST | `/api/documents/add-url` | Add a web URL |
| POST | `/api/documents/add-text` | Add raw text |
| DELETE | `/api/documents/clear` | Clear all documents |
| POST | `/api/chat/ask` | Ask a question |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Your Google Gemini API key from aistudio.google.com |

## Author

**Piyara Morawakaarachchi**
- GitHub: [@piyara99](https://github.com/piyara99)
- LinkedIn: [piyara-morawakaarachchi](https://www.linkedin.com/in/piyara-morawakaarachchi-20ab102a2/)

## License

MIT License — feel free to use this project for learning and personal projects.
