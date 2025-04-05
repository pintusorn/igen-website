'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setUserEmail(user.email)
      } else {
        router.push('/login') // redirect to login if not logged in
      }
    }

    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="max-w-md mx-auto mt-20 text-center">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      {userEmail ? (
        <>
          <p className="mb-4">Welcome, <strong>{userEmail}</strong></p>
          <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded">
            Log out
          </button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}
