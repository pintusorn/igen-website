'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/adminLayout'


export default function MemberInfoPage() {
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const role = localStorage.getItem('role')
    if (role !== 'admin') {
      router.push('/login') // redirect non-admin users
      return
    }

    const fetchUsers = async () => {
      const { data, error } = await supabase.from('user').select('*')
      if (error) {
        console.error('Error fetching users:', error)
      } else {
        setUsers(data)
      }
      setIsLoading(false)
    }

    fetchUsers()
  }, [router])

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6 text-center">All Members Info</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-darkblue-100">
            <tr>
              <th className="border px-4 py-2">Full Name</th>
              <th className="border px-4 py-2">Username</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Club</th>
              <th className="border px-4 py-2">Role</th>
              <th className="border px-4 py-2">Score</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user_id}>
                <td className="border px-4 py-2">{user.firstname} {user.lastname}</td>
                <td className="border px-4 py-2">{user.username}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.igen_club}</td>
                <td className="border px-4 py-2">{user.role}</td>
                <td className="border px-4 py-2">{user.current_score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </AdminLayout>
  )
  
}
