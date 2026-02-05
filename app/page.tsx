'use client'

import { Tldraw, Editor } from 'tldraw'
import 'tldraw/tldraw.css'
import { useState, useRef } from 'react'

export default function Home() {
  const editorRef = useRef<Editor | null>(null)
  const [jsonInput, setJsonInput] = useState('')
  const [status, setStatus] = useState('')
  const [showPaste, setShowPaste] = useState(false)

  const handleMount = (editor: Editor) => {
    editorRef.current = editor
    setStatus('Canvas ready')
  }

  // Paste raw JSON string
  const handlePasteJson = () => {
    if (!editorRef.current || !jsonInput.trim()) {
      setStatus('❌ Paste JSON data first')
      return
    }

    try {
      let data = jsonInput.trim()
      
      // Handle tldraw format (TLDRAW_DOCUMENT_v3:{...})
      if (data.startsWith('TLDRAW_DOCUMENT_v3:')) {
        data = data.substring('TLDRAW_DOCUMENT_v3:'.length)
      }
      
      const records = JSON.parse(data)
      
      editorRef.current.store.clear()
      
      // If it's the tldraw.com export format (array of records)
      if (Array.isArray(records)) {
        editorRef.current.store.deserialize(records, 'json')
      } else if (typeof records === 'object') {
        // If it's the raw data structure
        editorRef.current.store.deserialize(records, 'json')
      }
      
      setStatus('✅ Loaded from JSON')
      setJsonInput('')
      setShowPaste(false)
    } catch (e) {
      setStatus(`❌ Invalid JSON: ${(e as Error).message}`)
    }
  }

  // Export canvas as JSON
  const handleExport = async () => {
    if (!editorRef.current) return
    const records = editorRef.current.store.allRecords()
    const json = JSON.stringify(records, null, 2)
    
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tldraw-${Date.now()}.json`
    a.click()
    setStatus('✅ Exported as JSON')
  }

  // Import JSON file
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editorRef.current || !e.target.files?.[0]) return
    
    const file = e.target.files[0]
    const text = await file.text()
    
    try {
      let data = text.trim()
      if (data.startsWith('TLDRAW_DOCUMENT_v3:')) {
        data = data.substring('TLDRAW_DOCUMENT_v3:'.length)
      }
      
      const records = JSON.parse(data)
      editorRef.current.store.clear()
      editorRef.current.store.deserialize(records, 'json')
      setStatus('✅ Imported from JSON')
    } catch (e) {
      setStatus(`❌ Invalid JSON: ${(e as Error).message}`)
    }
  }

  // Get shape count
  const handleAnalyze = () => {
    if (!editorRef.current) return
    const shapes = editorRef.current.getCurrentPageShapes()
    const types = {} as Record<string, number>
    
    shapes.forEach(s => {
      types[s.type] = (types[s.type] || 0) + 1
    })
    
    setStatus(`📊 Shapes: ${shapes.length} | ${JSON.stringify(types)}`)
  }

  // Transform all shapes (example: move right 100px)
  const handleTransform = () => {
    if (!editorRef.current) return
    
    const shapes = editorRef.current.getCurrentPageShapes()
    editorRef.current.run(() => {
      editorRef.current?.updateShapes(
        shapes.map(s => ({
          id: s.id,
          type: s.type,
          x: s.x + 100,
        }))
      )
    })
    setStatus('✅ Moved all shapes right 100px')
  }

  // Delete all shapes
  const handleClear = () => {
    if (!editorRef.current) return
    const shapes = editorRef.current.getCurrentPageShapes()
    editorRef.current.deleteShapes(shapes.map(s => s.id))
    setStatus('✅ Cleared canvas')
  }

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toolbar */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: '#f0f0f0',
        borderBottom: '1px solid #ccc',
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>tldraw Editor</h2>
        
        <button onClick={() => setShowPaste(!showPaste)} style={buttonStyle}>
          📋 Paste JSON
        </button>
        
        <button onClick={handleExport} style={buttonStyle}>
          📥 Export JSON
        </button>
        
        <label style={{ ...buttonStyle, cursor: 'pointer' }}>
          📤 Import File
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: 'none' }}
          />
        </label>
        
        <button onClick={handleAnalyze} style={buttonStyle}>
          📊 Analyze
        </button>
        
        <button onClick={handleTransform} style={buttonStyle}>
          ➡️ Transform
        </button>
        
        <button onClick={handleClear} style={buttonStyle} title="Clear all shapes">
          🗑️ Clear
        </button>
        
        <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#666' }}>
          {status}
        </div>
      </div>

      {/* Paste Modal */}
      {showPaste && (
        <div style={{
          position: 'absolute',
          top: '50px',
          left: '16px',
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '16px',
          zIndex: 1000,
          width: '500px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '14px' }}>Paste JSON from tldraw.com</h3>
          <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>
            From DevTools → Application → Local Storage → TLDRAW_DOCUMENT_v3 value
          </p>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste the JSON here..."
            style={{
              width: '100%',
              height: '120px',
              padding: '8px',
              fontSize: '11px',
              fontFamily: 'monospace',
              border: '1px solid #ddd',
              borderRadius: '3px',
              marginBottom: '8px'
            }}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handlePasteJson} style={buttonStyle}>
              ✅ Load
            </button>
            <button onClick={() => setShowPaste(false)} style={{...buttonStyle, backgroundColor: '#999'}}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div style={{ flex: 1, position: 'relative' }}>
        <Tldraw onMount={handleMount} />
      </div>
    </div>
  )
}

const buttonStyle = {
  padding: '8px 12px',
  backgroundColor: '#0070f3',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  fontSize: '14px',
  cursor: 'pointer',
  fontWeight: '500',
} as React.CSSProperties
