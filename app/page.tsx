'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Copy, Save } from 'lucide-react'

const languages = [
  { value: 'plaintext', label: 'Plain Text' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'cpp', label: 'C++' },
]

const expirationOptions = [
  { value: 'never', label: 'Never' },
  { value: '1h', label: '1 Hour' },
  { value: '1d', label: '1 Day' },
  { value: '1w', label: '1 Week' },
]

export default function Home() {
  const [content, setContent] = useState('')
  const [language, setLanguage] = useState('plaintext')
  const [expiration, setExpiration] = useState('never')
  const [customLink, setCustomLink] = useState('')
  const [savedLink, setSavedLink] = useState('')
  const [error, setError] = useState('')

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('/api/paste', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          language,
          expiration,
          customLink,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save paste')
      }

      const data = await response.json()
      setSavedLink(`${window.location.origin}/paste/${data.id}`)
    } catch (err) {
      setError('Failed to save paste. Please try again.')
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Card className="flex-grow flex flex-col m-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">CodeShare</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={copyToClipboard} disabled={!content || !!savedLink}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button size="sm" onClick={handleSave} disabled={!content || !!savedLink}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {savedLink && (
            <Alert>
              <Check className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                Your code has been saved. Share it using this link:
                <a href={savedLink} className="block mt-2 text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                  {savedLink}
                </a>
              </AlertDescription>
            </Alert>
          )}
          <div className="flex space-x-4">
            <div className="w-1/3">
              <Label htmlFor="custom-link">Custom Link (optional)</Label>
              <Input
                id="custom-link"
                placeholder="Enter custom link"
                value={customLink}
                onChange={(e) => setCustomLink(e.target.value)}
                disabled={!!savedLink}
              />
            </div>
            <div className="w-1/3">
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage} disabled={!!savedLink}>
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-1/3">
              <Label htmlFor="expiration">Expiration</Label>
              <Select value={expiration} onValueChange={setExpiration} disabled={!!savedLink}>
                <SelectTrigger id="expiration">
                  <SelectValue placeholder="Select expiration" />
                </SelectTrigger>
                <SelectContent>
                  {expirationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex-grow flex flex-col">
            <Label htmlFor="content" className="sr-only">Paste your code here</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your code here..."
              className="flex-grow resize-none"
              disabled={!!savedLink}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
                                          }
