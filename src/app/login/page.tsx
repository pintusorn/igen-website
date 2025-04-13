'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const { data, error } = await supabase
      .from('user')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single()

    if (error || !data) {
      setError('Invalid username or password')
    } else {
      localStorage.setItem('user_id', data.user_id)
      localStorage.setItem('role', data.role)

      if (data.role === 'admin') {
        router.push('/admin-memberInfo')
      } else {
        router.push('/profile')
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md border border-black-300 rounded-md p-8 shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6 font-playfair text-black">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full px-4 py-2 rounded border border-gray-800 text-gray-800 hover:bg-red-700 hover:text-white hover:border-red-700 transition-colors duration-200"
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="w-full px-4 py-2 rounded border border-gray-800 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
          >
            Back to Home
          </button>

          
        </form>
      </div>
    </div>
  )
}
