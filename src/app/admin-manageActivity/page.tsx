'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/adminLayout'

type Activity = {
  activity_id: string
  activity_name: string
  activity_description: string
  duration: number
  type: string
  location: string
  status: string
  deadline: string
}

export default function ManageActivityPage() {
  const router = useRouter()
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    const role = localStorage.getItem('role')
    if (role !== 'admin') {
      router.push('/login')
      return
    }

    const fetchActivities = async () => {
      const { data, error } = await supabase.from('activity').select('*')
      if (!error && data) {
        setActivities(data as Activity[])
      } else {
        console.error('Error fetching activities:', error)
      }
    }

    fetchActivities()
  }, [router])

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Activity</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-black-100">
            <tr>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Duration</th>
              <th className="border px-4 py-2">Type</th>
              <th className="border px-4 py-2">Location</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Deadline</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.activity_id}>
                <td className="border px-4 py-2">{activity.activity_name}</td>
                <td className="border px-4 py-2">{activity.activity_description}</td>
                <td className="border px-4 py-2">{activity.duration} mins</td>
                <td className="border px-4 py-2">{activity.type}</td>
                <td className="border px-4 py-2">{activity.location}</td>
                <td className="border px-4 py-2 text-center">
                  <button
                    className={`px-3 py-1 rounded text-white ${
                      activity.status === 'open' ? 'bg-green-500' : 'bg-gray-500'
                    }`}
                    onClick={async () => {
                      const newStatus = activity.status === 'open' ? 'closed' : 'open'
                      const { error } = await supabase
                        .from('activity')
                        .update({ status: newStatus })
                        .eq('activity_id', activity.activity_id)

                      if (!error) {
                        setActivities((prev) =>
                          prev.map((a) =>
                            a.activity_id === activity.activity_id
                              ? { ...a, status: newStatus }
                              : a
                          )
                        )
                      } else {
                        console.error('Failed to update status:', error.message)
                      }
                    }}
                  >
                    {activity.status === 'open' ? 'Open' : 'Closed'}
                  </button>
                </td>
                <td className="border px-4 py-2">{activity.deadline?.slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}
