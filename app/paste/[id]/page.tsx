'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import { docco, dark } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Copy } from 'lucide-react'

// Import all languages you want to support
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript'
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python'
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java'
import csharp from 'react-syntax-highlighter/dist/esm/languages/hljs/csharp'
import cpp from 'react-syntax-highlighter/dist/esm/languages/hljs/cpp'

SyntaxHighlighter.registerLanguage('javascript', js)
SyntaxHighlighter.registerLanguage('python', python)
SyntaxHighlighter.registerLanguage('java', java)
SyntaxHighlighter.registerLanguage('csharp', csharp)
SyntaxHighlighter.registerLanguage('cpp', cpp)

export default function PasteView() {
  const { id } = useParams() as { id: string }  // Type assertion for `id`
  const [paste, setPaste] = useState({ content: '', language: 'plaintext', createdAt: new Date() })
  const [error, setError] = useState('')
  const { theme } = useTheme()

  useEffect(() => {
    const fetchPaste = async () => {
      try {
        const response = await fetch(`/api/paste/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch paste')
        }
        const data = await response.json()
        setPaste(data)
      } catch (err) {
        setError('Failed to load paste. It may have expired or been removed.')
      }
    }

    if (id) {
      fetchPaste()
    }
  }, [id])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(paste.content)
  }

  if (error) {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Shared Code</span>
          <Button variant="outline" size="sm" onClick={copyToClipboard}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <strong>Language:</strong> {paste.language}
        </div>
        <div className="mb-4">
          <strong>Created:</strong> {new Date(paste.createdAt).toLocaleString()}
        </div>
        <SyntaxHighlighter
          language={paste.language}
          style={theme === 'dark' ? dark : docco}
          customStyle={{
            padding: '1rem',
            borderRadius: '0.5rem',
          }}
        >
          {paste.content}
        </SyntaxHighlighter>
      </CardContent>
    </Card>
  )
}
