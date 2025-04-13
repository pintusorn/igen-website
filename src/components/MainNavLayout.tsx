'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import React from 'react'

export default function MainNavLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [nickname, setNickname] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)

  const [avatarUrl] = useState<string>('https://i.pravatar.cc/40')
  const [showDropdown, setShowDropdown] = useState(false)
  const [isUserLoading, setIsUserLoading] = useState(true)




  const pages = [
    { name: 'About Us', path: '/aboutUs' },
    { name: 'Activity', path: '/activity' },
    { name: 'Join Us', path: '/joinUs' },
    { name: 'News', path: '/news' },
    { name: 'Support Us', path: '/supportUs' },
    { name: 'Contact Us', path: '/contactUs' },
  ]

  useEffect(() => {
    const fetchUserInfo = async () => {
      const user_id = localStorage.getItem('user_id')
      if (!user_id) return setIsUserLoading(false)
  
      const { data, error } = await supabase
        .from('user')
        .select('nickname, role')
        .eq('user_id', user_id)
        .single()
  
      if (!error && data) {
        setNickname(data.nickname)
        setRole(data.role)
      }
  
      setIsUserLoading(false)
    }
  
    fetchUserInfo()
  }, [])
  
  

  const handleLogout = () => {
    localStorage.removeItem('user_id')
    localStorage.removeItem('role')
    setNickname(null)
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Nav bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white flex items-center justify-between px-6 py-4 shadow-sm">
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

          {/* Tabs */}
          <div className="flex space-x-6 font-playfair">
            {pages.map((page) => {
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

        {/* Right-side: Conditional */}
        <div className="flex items-center space-x-4">
          {!isUserLoading && ( 
            nickname ? (
              <div className="relative">
                {/* Hi, Nickname + Avatar */}
                <div className="flex items-center space-x-3">
                  <span className="text-lg text-gray-800 font-semibold">Hi, {nickname}</span>
                  <img
                    src={avatarUrl}
                    alt="User Avatar"
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="w-10 h-10 rounded-full border border-gray-300 cursor-pointer"
                  />
                </div>


                {/* Dropdown menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-md z-50">
                    <ul className="py-2 text-sm text-gray-700">
                      {role === 'admin' ? (
                        <>
                          <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => router.push('/admin-memberInfo')}
                          >
                            Member Info
                          </li>
                          <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => router.push('/admin-manageActivity')}
                          >
                            Manage Activities
                          </li>
                          <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => router.push('/admin-manageBlog')}
                          >
                            Manage Blog
                          </li>
                          <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => router.push('/admin-dataAnalytic')}
                          >
                            Data Analytic
                          </li>
                        </>
                      ) : (
                        <>
                          <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => router.push('/profile')}
                          >
                            My Profile
                          </li>
                          <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => router.push('/myActivity')}
                          >
                            My Activities
                          </li>
                        </>
                      )}
                      <li
                        className="px-4 py-2 hover:bg-gray-100 text-red-600 cursor-pointer"
                        onClick={handleLogout}
                      >
                        Log Out
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => router.push('/login')}
                  className="px-4 py-1 rounded border border-gray-800 bg-gray-800 text-white hover:bg-red-700 hover:border-red-700 transition-colors duration-200"
                >
                  Log In
                </button>

                <button
                  onClick={() => router.push('/signup')}
                  className="px-4 py-1 rounded border border-gray-800 bg-white text-gray-800 hover:text-red-700 hover:border-red-700 transition-colors duration-200"
                >
                  Sign Up
                </button>
              </>
            )
          )}

        </div>

      </div>

      {/* Page content */}
      <main className="pt-28 max-w-5xl mx-auto px-6 py-10">{children}</main>
    </div>
  )
}
