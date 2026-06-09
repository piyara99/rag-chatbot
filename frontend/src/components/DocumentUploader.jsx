import { useState } from 'react'
import axios from 'axios'

const API = 'http://localhost:8000/api'

export default function DocumentUploader({ onDocumentAdded }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [url, setUrl] = useState('')
  const [text, setText] = useState('')
  const [activeTab, setActiveTab] = useState('pdf')
  const [documents, setDocuments] = useState([])

  const showMessage = (msg, isError = false) => {
    setMessage({ text: msg, isError })
    setTimeout(() => setMessage(''), 4000)
  }

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await axios.post(`${API}/documents/upload-pdf`, formData)
      setDocuments(prev => [...prev, { name: file.name, type: 'PDF', chunks: res.data.chunks }])
      showMessage(`✓ Added ${file.name} (${res.data.chunks} chunks)`)
      onDocumentAdded()
    } catch (err) {
      showMessage(err.response?.data?.detail || 'Failed to upload PDF', true)
    }
    setLoading(false)
    e.target.value = ''
  }

  const handleUrlAdd = async () => {
    if (!url.trim()) return
    setLoading(true)
    try {
      const res = await axios.post(`${API}/documents/add-url`, { url })
      setDocuments(prev => [...prev, { name: url, type: 'URL', chunks: res.data.chunks }])
      showMessage(`✓ Added URL (${res.data.chunks} chunks)`)
      setUrl('')
      onDocumentAdded()
    } catch (err) {
      showMessage(err.response?.data?.detail || 'Failed to fetch URL', true)
    }
    setLoading(false)
  }

  const handleTextAdd = async () => {
    if (!text.trim()) return
    setLoading(true)
    try {
      const res = await axios.post(`${API}/documents/add-text`, { text, filename: 'pasted_text.txt' })
      setDocuments(prev => [...prev, { name: 'Pasted text', type: 'Text', chunks: res.data.chunks }])
      showMessage(`✓ Added text (${res.data.chunks} chunks)`)
      setText('')
      onDocumentAdded()
    } catch (err) {
      showMessage(err.response?.data?.detail || 'Failed to add text', true)
    }
    setLoading(false)
  }

  const handleClear = async () => {
    if (!confirm('Clear all documents?')) return
    await axios.delete(`${API}/documents/clear`)
    setDocuments([])
    showMessage('All documents cleared')
  }

  return (
    <div className="uploader">
      <div className="panel-header">
        <h2>Documents</h2>
        {documents.length > 0 && (
          <button className="btn-clear" onClick={handleClear}>Clear All</button>
        )}
      </div>

      <div className="tabs">
        {['pdf', 'url', 'text'].map(tab => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'pdf' && (
          <div className="upload-area">
            <label className="file-label">
              <input type="file" accept=".pdf" onChange={handlePdfUpload} disabled={loading} />
              <div className="file-drop">
                <span className="file-icon">📄</span>
                <span>{loading ? 'Processing...' : 'Click to upload PDF'}</span>
              </div>
            </label>
          </div>
        )}

        {activeTab === 'url' && (
          <div className="input-group">
            <input
              type="url"
              placeholder="https://example.com/article"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleUrlAdd()}
              disabled={loading}
            />
            <button onClick={handleUrlAdd} disabled={loading || !url.trim()}>
              {loading ? '...' : 'Add'}
            </button>
          </div>
        )}

        {activeTab === 'text' && (
          <div className="text-group">
            <textarea
              placeholder="Paste your text here..."
              value={text}
              onChange={e => setText(e.target.value)}
              rows={6}
              disabled={loading}
            />
            <button onClick={handleTextAdd} disabled={loading || !text.trim()}>
              {loading ? 'Processing...' : 'Add Text'}
            </button>
          </div>
        )}
      </div>

      {message && (
        <div className={`message ${message.isError ? 'error' : 'success'}`}>
          {message.text}
        </div>
      )}

      {documents.length > 0 && (
        <div className="doc-list">
          <p className="doc-list-title">{documents.length} document(s) loaded</p>
          {documents.map((doc, i) => (
            <div key={i} className="doc-item">
              <span className="doc-type">{doc.type}</span>
              <span className="doc-name">{doc.name.length > 40 ? doc.name.slice(0, 40) + '...' : doc.name}</span>
              <span className="doc-chunks">{doc.chunks} chunks</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
