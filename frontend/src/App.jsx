import { useState } from 'react'
import DocumentUploader from './components/DocumentUploader'
import ChatInterface from './components/ChatInterface'
import './App.css'

function App() {
  const [documentsLoaded, setDocumentsLoaded] = useState(false)

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>RAG Document Q&A</h1>
          <p>Upload documents and ask questions powered by Gemini AI</p>
        </div>
      </header>
      <main className="main">
        <div className="left-panel">
          <DocumentUploader onDocumentAdded={() => setDocumentsLoaded(true)} />
        </div>
        <div className="right-panel">
          <ChatInterface documentsLoaded={documentsLoaded} />
        </div>
      </main>
    </div>
  )
}

export default App
