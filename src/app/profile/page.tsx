'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import MemberLayout from '@/components/memberLayout'

export default function ProfilePage() {
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

  if (isLoading || !user) {
    return <p className="text-center mt-20">Loading profile...</p>
  }

  return (
    <MemberLayout>
      <h1 className="text-3xl font-bold mb-6 text-center">My Profile</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <tbody>
            <tr>
              {/* Column 1: Image */}
              <td className="border px-4 py-6 w-[180px] text-center align-top">
                <img
                  src={'/avatar.jpeg'}
                  alt="Profile"
                  className="w-32 h-32 object-cover mx-auto border border-gray-400 rounded-md"
                />


                <button
                  className="mt-4 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  onClick={() => alert('Image change coming soon!')}
                >
                  Change image
                </button>
              </td>

              {/* Column 2 & 3: Info */}
              <td className="border px-6 py-4 w-1/2 font-semibold text-gray-700">
                <div className="mb-2">Username</div>
                <div className="mb-2">Email</div>
                <div className="mb-2">First Name</div>
                <div className="mb-2">Last Name</div>
                <div className="mb-2">Nickname</div>
                <div className="mb-2">Club</div>
                <div className="mb-2">Role</div>
              </td>

              <td className="border px-6 py-4 w-1/2 text-gray-900">
                <div className="mb-2">{user.username}</div>
                <div className="mb-2">{user.email}</div>
                <div className="mb-2">{user.firstname}</div>
                <div className="mb-2">{user.lastname}</div>
                <div className="mb-2">{user.nickname}</div>
                <div className="mb-2">{user.igen_club}</div>
                <div className="mb-2 capitalize">{user.role}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </MemberLayout>
  )
}
