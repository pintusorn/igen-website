'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    firstname: '',
    lastname: '',
    nickname: '',
    dob: '',
    gender: '',
    student_status: '',
    home_country: '',
    latest_university: '',
    study_year: '',
    degree: '',
    interest: '',
    current_score: '',
    role: '',
    telephone: '',
    igen_club: '',
    supervisor: '',
  })

  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    const { email, password, ...profileData } = formData

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
    if (signUpError) {
      setError(signUpError.message)
      return
    }

    const { error: insertError } = await supabase.from('user').insert([{ email, password, ...profileData }])
    if (insertError) {
      setError(insertError.message)
      return
    }

    router.push('/login')
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-md rounded-lg p-8 text-black">
      <h1 className="text-3xl font-bold mb-6 text-center">Register</h1>
      <form onSubmit={handleSignup} className="space-y-4">
        {[
          ['firstname', 'First Name'],
          ['lastname', 'Last Name'],
          ['nickname', 'Nickname'],
          ['dob', 'Date of Birth'],
          ['gender', 'Gender'],
          ['student_status', 'Student Status'],
          ['home_country', 'Home Country'],
          ['latest_university', 'Latest University'],
          ['study_year', 'Study Year'],
          ['degree', 'Degree'],
          ['interest', 'Interest'],
          ['current_score', 'Current Score'],
          ['role', 'Role'],
          ['telephone', 'Telephone'],
          ['igen_club', 'IGEN Club'],
          ['supervisor', 'Supervisor'],
          ['username', 'Username'],
          ['email', 'Email'],
          ['password', 'Password'],
        ].map(([key, label]) => (
          <div key={key} className="flex flex-col">
            <label htmlFor={key} className="text-sm font-medium mb-1">{label}</label>
            <input
              type={key === 'password' ? 'password' : 'text'}
              name={key}
              id={key}
              placeholder={label}
              value={(formData as any)[key]}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md"
              required
            />
          </div>
        ))}
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded-md w-full hover:bg-green-700 transition-colors"
        >
          Sign Up
        </button>
      </form>
    </div>
  )
}
