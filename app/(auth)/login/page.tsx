'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import { Input } from '@/app/components/common/Input'
import { Button } from '@/app/components/common/Button'
import { Alert } from '@/app/components/common/Alert'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setEmailError('')
    setPasswordError('')

    // Validation
    let isValid = true
    if (!email) {
      setEmailError('Email is required')
      isValid = false
    }
    if (!password) {
      setPasswordError('Password is required')
      isValid = false
    }

    if (!isValid) return

    setLoading(true)

    try {
      await login(email, password)
      router.push('/dashboard')
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Login failed. Please check your credentials and try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">HW247 Admin</h1>
            <p className="text-gray-600">Portal Administration & Control Center</p>
          </div>

          {error && (
            <div className="mb-6">
              <Alert type="error" title="Login Error" dismissible onDismiss={() => setError('')}>
                {error}
              </Alert>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email Address"
              placeholder="admin@hw247.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setEmailError('')
              }}
              error={emailError}
              required
              disabled={loading}
            />

            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setPasswordError('')
              }}
              error={passwordError}
              required
              disabled={loading}
            />

            <Button type="submit" fullWidth loading={loading} size="md">
              Sign In
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600 mb-4">Demo Credentials:</p>
            <div className="bg-gray-50 rounded p-4 text-xs text-gray-600 font-mono space-y-1">
              <p>Email: admin@hw247.com</p>
              <p>Password: See documentation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
