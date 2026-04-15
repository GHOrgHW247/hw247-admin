'use client'

import { useState } from 'react'
import { DisputeMessage } from '@/lib/types'
import { Card } from '@/app/components/common/Card'
import { Button } from '@/app/components/common/Button'
import { Input } from '@/app/components/common/Input'
import { Alert } from '@/app/components/common/Alert'
import { formatDateTime } from '@/lib/utils'

interface DisputeThreadProps {
  rmaNumber: string
  messages: DisputeMessage[]
  onAddMessage?: (message: string) => Promise<void>
}

export function DisputeThread({ rmaNumber, messages, onAddMessage }: DisputeThreadProps) {
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      setError('Message cannot be empty')
      return
    }

    setSending(true)
    setError('')

    try {
      if (onAddMessage) {
        await onAddMessage(newMessage)
        setNewMessage('')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const getSenderColor = (sender: string) => {
    switch (sender) {
      case 'buyer':
        return 'bg-blue-50 border-blue-200'
      case 'vendor':
        return 'bg-orange-50 border-orange-200'
      case 'admin':
        return 'bg-green-50 border-green-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const getSenderBadge = (sender: string) => {
    switch (sender) {
      case 'buyer':
        return 'bg-blue-100 text-blue-800'
      case 'vendor':
        return 'bg-orange-100 text-orange-800'
      case 'admin':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card title="Dispute Thread" subtitle="Communication between parties">
      <div className="space-y-4">
        {/* Messages */}
        <div className="space-y-3 max-h-96 overflow-y-auto bg-gray-50 p-4 rounded border border-gray-200">
          {messages.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No messages yet. Start a conversation.</p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`p-4 rounded border ${getSenderColor(msg.sender)}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getSenderBadge(msg.sender)}`}>
                    {msg.sender.toUpperCase()}
                  </span>
                  <span className="font-medium text-sm">{msg.sender_name}</span>
                  <span className="text-xs text-gray-600">{formatDateTime(msg.created_at)}</span>
                </div>
                <p className="text-sm text-gray-800 whitespace-pre-wrap">{msg.message}</p>
              </div>
            ))
          )}
        </div>

        {/* Error Alert */}
        {error && <Alert type="error">{error}</Alert>}

        {/* Add Message */}
        <div className="space-y-3 pt-2 border-t border-gray-200">
          <p className="font-medium text-gray-900">Add Admin Comment</p>
          <Input
            placeholder="Type your message here..."
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value)
              setError('')
            }}
            multiline
            rows={3}
            disabled={sending}
          />
          <div className="flex gap-2">
            <Button
              variant="primary"
              fullWidth
              loading={sending}
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              Send Message
            </Button>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setNewMessage('')}
              disabled={sending}
            >
              Clear
            </Button>
          </div>
        </div>

        {/* Guidelines */}
        <div className="bg-blue-50 p-3 rounded border border-blue-200 text-sm text-blue-800">
          <p className="font-medium mb-1">Communication Guidelines</p>
          <ul className="space-y-1 text-xs">
            <li>✓ Be professional and courteous</li>
            <li>✓ Provide clear explanations</li>
            <li>✓ Respond within 24 hours</li>
            <li>✓ Escalate to supervisor if needed after 3 days</li>
          </ul>
        </div>
      </div>
    </Card>
  )
}
