'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import MemberLayout from '@/components/memberLayout'

export default function MyActivityPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userId = localStorage.getItem('user_id')

    if (!userId) {
      router.push('/login')
      return
    }

    const fetchUser = async () => {
      const { data, error } = await supabase
        .from('user')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Error fetching user:', error)
        router.push('/login')
      } else {
        setUser(data)
      }
      setIsLoading(false)
    }

    fetchUser()
  }, [])


  return (
    <MemberLayout>
      <h1 className="text-3xl font-bold mb-6 text-center">My Profile</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-darkblue-100">
            <tr>
              <th className="border px-4 py-2">Username</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Full Name</th>
              <th className="border px-4 py-2">Club</th>
              <th className="border px-4 py-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {user && (
              <tr>
                <td className="border px-4 py-2">{user.username}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.firstname} {user.lastname}</td>
                <td className="border px-4 py-2">{user.igen_club}</td>
                <td className="border px-4 py-2">{user.role}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </MemberLayout>
  )
}
