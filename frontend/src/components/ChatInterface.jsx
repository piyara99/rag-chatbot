import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'

const API = 'http://localhost:8000/api'

export default function ChatInterface({ documentsLoaded }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! Upload some documents on the left, then ask me anything about them.'
    }
  ])
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleAsk = async () => {
    if (!question.trim() || loading) return
    const userMsg = question.trim()
    setQuestion('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)
    try {
      const res = await axios.post(`${API}/chat/ask`, { question: userMsg })
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: res.data.answer,
        sources: res.data.sources
      }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
        isError: true
      }])
    }
    setLoading(false)
  }

  return (
    <div className="chat">
      <div className="panel-header">
        <h2>Chat</h2>
        {documentsLoaded && <span className="status-dot">● Ready</span>}
      </div>

      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message-bubble ${msg.role}`}>
            <div className="bubble-content">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
            {msg.sources && msg.sources.length > 0 && (
              <div className="sources">
                <p className="sources-title">Sources:</p>
                {msg.sources.map((src, j) => (
                  <span key={j} className="source-tag">{src}</span>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="message-bubble assistant">
            <div className="typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder={documentsLoaded ? "Ask a question about your documents..." : "Upload documents first..."}
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAsk()}
          disabled={loading}
        />
        <button onClick={handleAsk} disabled={loading || !question.trim()}>
          {loading ? '...' : 'Ask'}
        </button>
      </div>
    </div>
  )
}
