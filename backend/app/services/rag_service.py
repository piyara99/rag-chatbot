import os
import io
import shutil
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
import PyPDF2
import requests
from bs4 import BeautifulSoup

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
CHROMA_PATH = "./chroma_db"

embeddings = GoogleGenerativeAIEmbeddings(
    model="models/text-embedding-004",
    google_api_key=GEMINI_API_KEY
)

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    google_api_key=GEMINI_API_KEY,
    temperature=0.3
)

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200
)

prompt = ChatPromptTemplate.from_template("""
Answer the question based only on the following context.
If you cannot find the answer in the context, say "I couldn't find information about that in the uploaded documents."

Context:
{context}

Question: {question}

Answer:
""")

def get_vectorstore():
    return Chroma(
        persist_directory=CHROMA_PATH,
        embedding_function=embeddings
    )

def add_documents(docs: list[Document]):
    chunks = text_splitter.split_documents(docs)
    Chroma.from_documents(
        chunks,
        embeddings,
        persist_directory=CHROMA_PATH
    )
    return len(chunks)

def extract_text_from_pdf(file_bytes: bytes, filename: str) -> list[Document]:
    reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
    docs = []
    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        if text and text.strip():
            docs.append(Document(
                page_content=text,
                metadata={"source": filename, "page": i + 1}
            ))
    return docs

def extract_text_from_url(url: str) -> list[Document]:
    response = requests.get(url, timeout=10)
    soup = BeautifulSoup(response.text, "html.parser")
    for tag in soup(["script", "style", "nav", "footer"]):
        tag.decompose()
    text = soup.get_text(separator="\n", strip=True)
    return [Document(page_content=text, metadata={"source": url})]

def extract_text_from_text(text: str, filename: str) -> list[Document]:
    return [Document(page_content=text, metadata={"source": filename})]

def query_documents(question: str) -> dict:
    vectorstore = get_vectorstore()
    retriever = vectorstore.as_retriever(search_kwargs={"k": 4})

    def format_docs(docs):
        return "\n\n".join(doc.page_content for doc in docs)

    chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )

    answer = chain.invoke(question)

    # Get sources separately
    source_docs = retriever.invoke(question)
    sources = []
    for doc in source_docs:
        source = doc.metadata.get("source", "Unknown")
        page = doc.metadata.get("page", "")
        source_str = f"{source}" + (f" (page {page})" if page else "")
        if source_str not in sources:
            sources.append(source_str)

    return {"answer": answer, "sources": sources}

def clear_documents():
    if os.path.exists(CHROMA_PATH):
        shutil.rmtree(CHROMA_PATH)
    return True
