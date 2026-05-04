import React, { useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export default function AuthModal({ isOpen, onClose, onLogin }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register'
      const payload = mode === 'login' ? { email, password } : { name, email, password }
      
      const res = await axios.post(`${API}${endpoint}`, payload)
      localStorage.setItem('eg_token', res.data.token)
      localStorage.setItem('eg_user', JSON.stringify(res.data.user))
      onLogin(res.data.user)
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  function handleOAuth(provider) {
    const redirectUri = `${window.location.origin}/auth/${provider}/callback`
    window.location.href = `${API}/auth/${provider}?redirect_uri=${encodeURIComponent(redirectUri)}`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-primary-900 to-primary-950 rounded-2xl shadow-2xl w-full max-w-md border border-primary-700/50">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <button onClick={onClose} className="text-primary-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleOAuth('github')}
              className="w-full flex items-center justify-center gap-3 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all duration-200 border border-white/10"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Continue with GitHub
            </button>
            
            <button
              onClick={() => handleOAuth('google')}
              className="w-full flex items-center justify-center gap-3 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all duration-200 border border-white/10"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M5.27 9.76c-.23-.86-.23-1.82 0-2.68l7.44-3.68c.86-.43 1.94-.43 2.8 0l7.44 3.68c.86.43 1.38 1.41 1.38 2.42v7.36c0 1.01-.52 1.99-1.38 2.42l-7.44 3.68c-.86.43-1.94.43-2.8 0l-7.44-3.68c-.86-.43-1.38-1.41-1.38-2.42V9.76z"/>
                <path fill="#FBBC05" d="M16.04 18.01l-3.52 2.52c.86.86 2.13 1.39 3.44 1.39 3.1 0 5.6-2.52 5.6-5.6v-.33l-5.52-3.52z"/>
                <path fill="#34A853" d="M16.04 9.33L16 9.28 12.5 5.78c-.86-.86-2.13-1.39-3.44-1.39-3.1 0-5.6 2.52-5.6 5.6 0 1.69.76 3.23 1.96 4.25l3.52-2.52c-.46-.5-.76-1.14-.76-1.79 0-1.53 1.24-2.77 2.77-2.77.65 0 1.27.23 1.75.66l3.52-2.52z"/>
                <path fill="#4A154B" d="M5.52 21.34c-.28.11-.58.17-.9.17-1.42 0-2.64-.93-3.25-2.25l-3.44 1.95c1.31 2.22 3.8 3.75 6.6 3.75 1.42 0 2.76-.4 3.89-1.08l3.44 1.93c-1.67 1.07-3.67 1.72-5.86 1.72-4.17 0-7.72-2.72-9.03-6.42l3.55-1.97z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-primary-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-primary-900 text-primary-400">or</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-4 bg-primary-800/50 border border-primary-600/50 rounded-xl text-white placeholder-primary-500 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all"
                  required
                />
              </div>
            )}
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-4 bg-primary-800/50 border border-primary-600/50 rounded-xl text-white placeholder-primary-500 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-4 bg-primary-800/50 border border-primary-600/50 rounded-xl text-white placeholder-primary-500 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all"
                required
              />
            </div>
            
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-primary-900 font-bold rounded-xl transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-primary-400">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            </span>
            <button
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null) }}
              className="text-gold-400 hover:text-gold-300 font-medium ml-2"
            >
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}