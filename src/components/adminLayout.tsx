'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import React from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [nickname, setNickname] = useState<string | null>(null)

  const adminPages = [
    { name: 'Member Info', path: '/admin-memberInfo' },
    { name: 'Manage Activity', path: '/admin-manageActivity' },
    { name: 'Data Analytic', path: '/admin-dataAnalytic' },
  ]

  const handleLogout = () => {
    localStorage.removeItem('user_id')
    localStorage.removeItem('role')
    router.push('/')
  }

  useEffect(() => {
    const fetchNickname = async () => {
      const user_id = localStorage.getItem('user_id')
      if (!user_id) return

      const { data, error } = await supabase
        .from('user')
        .select('nickname')
        .eq('user_id', user_id)
        .single()

      if (data?.nickname && !error) {
        setNickname(data.nickname)
      }
    }

    fetchNickname()
  }, [])

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Admin Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white flex items-center justify-between px-6 py-4 shadow-sm">
        {/* Left: Logo + Tabs */}
        <div className="flex items-center ml-4">
          {/* Logo */}
          <button onClick={() => router.push('/')} className="mr-10">
            <Image
              src="/logo.jpg"
              alt="IGEN Logo"
              width={70}
              height={32}
              className="cursor-pointer"
            />
          </button>

          {/* Admin Tabs */}
          <div className="flex space-x-6 font-playfair">
            {adminPages.map((page) => {
              const isActive = pathname === page.path
              return (
                <button
                  key={page.name}
                  onClick={() => router.push(page.path)}
                  className={`relative pb-1 font-medium transition-all duration-150 ${
                    isActive
                      ? 'text-black border-b-2 border-red-500 cursor-default'
                      : 'text-gray-700 hover:text-red-600'
                  }`}
                  disabled={isActive}
                >
                  {page.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Right: Greeting + Log Out */}
        <div className="flex items-center space-x-4">
          {nickname && (
            <span className="text-lg text-gray-800 font-semibold">Hello, {nickname}</span>
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-1 rounded border border-gray-800 bg-white text-gray-800 hover:text-red-700 hover:border-red-700 transition-colors duration-200"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Page content */}
      <main className="pt-28 max-w-6xl mx-auto px-6 py-10">{children}</main>
    </div>
  )
}
