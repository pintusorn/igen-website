'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [mood, setMood] = useState<string | null>(null)


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
      
    if (authError || !authData?.user) {
      setError('Invalid email or password');
      return;
    }
    
    // Fetch role from custom 'user' table
    const { data: profile, error: profileError } = await supabase
      .from('user')
      .select('role, user_id')
      .eq('user_id', authData.user.id)
      .single();
    
    if (profileError || !profile) {
      setError('Failed to retrieve user profile');
      return;
    }
    
    localStorage.setItem('user_id', profile.user_id);
    localStorage.setItem('role', profile.role);
    
    router.push(profile.role === 'admin' ? '/admin-memberInfo' : '/profile');
    
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-[450px] mx-auto mt-10 bg-white shadow-md rounded-lg p-8 text-black">
        <h1 className="text-3xl font-bold text-center mb-6 font-playfair text-black">Hello there!</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm font-medium mb-1">Email:</label>
            <input
              id="email"
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}

              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="text-sm font-medium mb-1">Password:</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          <div className="flex flex-col mt-6">
            <label className="text-sm font-medium mb-2">How are you feeling today?</label>
            <div className="grid grid-cols-5 gap-4 mt-2">
              {[
                { emoji: "😇", label: "Bliss" },
                { emoji: "😊", label: "Happy" },
                { emoji: "😌", label: "Calm" },
                { emoji: "🥰", label: "Loved" },
                { emoji: "😂", label: "Funny" },
                { emoji: "🤩", label: "Excited" },
                { emoji: "😱", label: "Shock" },
                { emoji: "😭", label: "Emotional" },
                { emoji: "🤔", label: "Comtemplating" },
                { emoji: "😠", label: "Angry" },
              ].map(({ emoji, label }) => (
                <div
                  key={label}
                  title={label}
                  onClick={() => setMood(label)}
                  className={`w-12 h-12 flex items-center justify-center text-2xl transition-all duration-200 rounded-full cursor-pointer 
                    hover:scale-125 hover:bg-gray-200 ${
                      mood === label ? "bg-gray-300 scale-125" : ""
                    }`}
                >
                  {emoji}
                </div>
              ))}
            </div>
          </div>




          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="w-1/2 px-4 py-2 rounded border border-gray-800 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
            >
              Back to Home
            </button>
            <button
              type="submit"
              className="w-1/2 px-4 py-2 rounded border border-red-700 bg-red-700 text-white hover:bg-red-600 hover:border-red-600 transition-colors duration-200"
            >
              Login
            </button>
          </div>

          <button
            type="button"
            onClick={() => router.push('/signup')}
            className="w-full px-4 py-2 rounded border border-gray-700 bg-gray-700 text-white hover:bg-gray-800 hover:border-gray-800 transition-colors duration-200"
            >
            I want to register
          </button>

        </form>

      </div>
    </div>
  )
}
