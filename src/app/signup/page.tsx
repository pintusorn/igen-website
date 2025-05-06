'use client'

import { useState } from 'react'
import { useEffect } from 'react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()

  type FormData = {
    email: string;
    password: string;
    username: string;
    firstname: string;
    lastname: string;
    nickname: string;
    dob_day: string;
    dob_month: string;
    dob_year: string;
    gender: string;
    student_status: string;
    home_country: string;
    university: string;
    study_year: string;
    degree: string;
    interest: string;
    current_score: string;
    role: string;
    telephone: string;
    igen_club: string;
    interests: string[]; // ✅ fix here
    current_city: string;
    current_country: string;
    nationality: string;
    religious: string;
    faculty: string;
    major: string;
    occupation: string;
  };
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    username: '',
    firstname: '',
    lastname: '',
    nickname: '',
    dob_day: '',
    dob_month: '',
    dob_year: '',
    gender: '',
    student_status: '',
    home_country: '',
    university: '',
    study_year: '',
    degree: '',
    interest: '',
    current_score: '',
    role: '',
    telephone: '',
    igen_club: '',
    interests: [], // ✅ type-safe now
    current_city: '',
    current_country: '',
    nationality: '',
    religious: '',
    faculty: '',
    major: '',
    occupation: '',
  });
  

  
  const [nationalityList, setNationalityList] = useState<string[]>([])
  const [countryList, setCountryList] = useState<string[]>([])



  useEffect(() => {
    const fetchNationalities = async () => {
      try {
        const res = await fetch("https://restcountries.com/v3.1/all");
        const rawData = await res.json();
  
        type CountryData = {
          name: { common: string };
          demonyms?: { eng?: { m?: string } };
        };
  
        const data = rawData as CountryData[];
  
        const nationalities: string[] = data
          .map((c) => c.demonyms?.eng?.m)
          .filter((n): n is string => Boolean(n)); // type guard
  
        const countries: string[] = data
          .map((c) => c.name.common)
          .filter(Boolean);
  
        setNationalityList([...new Set(nationalities)].sort());
        setCountryList([...new Set(countries)].sort());
  
        console.log("Loaded nationalities:", nationalities);
        console.log("Loaded countries:", countries);
      } catch (error) {
        console.error("Failed to fetch countries/nationalities:", error);
      }
    };
  
    fetchNationalities();
  }, []);
  


  // type FormKey = keyof typeof formData

  const [error, setError] = useState('')
  const [studentStatus, setStudentStatus] = useState<string>('')  // 'yes', 'no', 'graduate'
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const [customInterest, setCustomInterest] = useState("")
  const [customInterests, setCustomInterests] = useState<string[]>([])
  const [phoneError, setPhoneError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)








  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  

    try {
      const role =
        formData.student_status === 'no' &&
        formData.occupation?.toLowerCase() === 'staff'
          ? 'admin'
          : 'member';

      const dob = `${formData.dob_year.padStart(2, '0')}-${formData.dob_month.padStart(2, '0')}-${formData.dob_day.padStart(2, '0')}`;
      const interest = formData.interests.join(', ');
      const { password, email, ...rest } = formData;

      const profileData = {
        ...rest,
        dob,
        interest,
        role,
        current_score: 0,
        created_at: new Date().toISOString(),
      };
      

      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, profileData }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Registration failed');

      router.push('/login');

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  }
  
  

  
  const validateUsername = async (username: string) => {
    if (username.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      return;
    }
  
    const { data } = await supabase
      .from('user')
      .select('username')
      .eq('username', username)
      .single();
  
    if (data) {
      setUsernameError("This username is already taken");
    } else {
      setUsernameError(null);
    }
  };
  
  
  return (
    <div className="min-h-screen w-full bg-white">
      <div className="max-w-2xl mx-auto mt-10 bg-white shadow-md rounded-lg p-8 text-black">
        <h1 className="text-3xl font-bold mb-6 text-center">Let&apos;s get to know more about you!</h1>
        <form onSubmit={handleSignup} className="space-y-4">

          {/* First row: First name and Last name */}
          <div className="flex gap-4">
            <div className="flex flex-col w-1/2">
              <label htmlFor="firstname" className="text-sm font-medium mb-1">First Name</label>
              <input
                type="text"
                name="firstname"
                id="firstname"
                placeholder="First Name"
                value={formData.firstname}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
                required
              />
            </div>
            <div className="flex flex-col w-1/2">
              <label htmlFor="lastname" className="text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                name="lastname"
                id="lastname"
                placeholder="Last Name"
                value={formData.lastname}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
                required
              />
            </div>
          </div>

          {/* Row: Nickname, Gender, DoB */}
          <div className="flex gap-4">
            {/* Nickname */}
            <div className="flex flex-col w-2/5">
              <label htmlFor="nickname" className="text-sm font-medium mb-1">Nickname</label>
              <input
                type="text"
                name="nickname"
                id="nickname"
                placeholder="Nickname"
                value={formData.nickname}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
                required
              />
            </div>

            {/* Gender */}
            <div className="flex flex-col w-1/5">
              <label className="text-sm font-medium mb-1 text-center">Gender</label>
              <div className="flex justify-center gap-x-4 mt-1">
                {[
                  { emoji: "👨", label: "Male" },
                  { emoji: "👩", label: "Female" },
                ].map(({ emoji, label }) => (
                  <div
                    key={label}
                    title={label}
                    onClick={() => setFormData((prev) => ({ ...prev, gender: label }))}
                    className={`w-10 h-10 flex items-center justify-center text-xl rounded-full cursor-pointer transition-all duration-200 
                      hover:scale-125 hover:bg-gray-200 ${
                        formData.gender === label ? "bg-gray-300 scale-125 shadow-md" : ""
                      }`}
                  >
                    {emoji}
                  </div>
                ))}
              </div>
            </div>

            {/* DoB */}
            <div className="flex flex-col w-2/5">
              <label className="text-sm font-medium mb-1">Date of Birth</label>
              <div className="flex gap-1">
                <select
                  name="dob_day"
                  value={formData.dob_day || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, dob_day: e.target.value }))}
                  className="border border-gray-300 p-1 rounded w-1/3"
                >
                  <option value="">Day</option>
                  {Array.from({ length: 31 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>

                <select
                  name="dob_month"
                  value={formData.dob_month || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, dob_month: e.target.value }))}
                  className="border border-gray-300 p-1 rounded w-1/3"
                >
                  <option value="">Month</option>
                  {[
                    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                  ].map((month, index) => (
                    <option key={month} value={index + 1}>{month}</option>
                  ))}
                </select>

                <select
                  name="dob_year"
                  value={formData.dob_year || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, dob_year: e.target.value }))}
                  className="border border-gray-300 p-1 rounded w-1/3"
                >
                  <option value="">Year</option>
                  {Array.from({ length: 100 }, (_, i) => {
                    const year = new Date().getFullYear() - i
                    return <option key={year} value={year}>{year}</option>
                  })}
                </select>
              </div>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            {/* Nationality with suggestions */}
            <div className="flex flex-col w-1/3">
              <label htmlFor="nationality" className="text-sm font-medium mb-1">Nationality</label>
              <input
                list="nationality-options"
                type="text"
                name="nationality"
                id="nationality"
                placeholder="Nationality"
                value={formData.nationality || ''}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
              />
              <datalist id="nationality-options">
                {nationalityList.map((nat) => (
                  <option key={nat} value={nat} />
                ))}
              </datalist>
            </div>

            {/* Home Country with suggestions */}
            <div className="flex flex-col w-1/3">
              <label htmlFor="home_country" className="text-sm font-medium mb-1">Home Country</label>
              <input
                list="country-options"
                type="text"
                name="home_country"
                id="home_country"
                placeholder="Home Country"
                value={formData.home_country || ''}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
              />
              <datalist id="country-options">
                {countryList.map((country) => (
                  <option key={country} value={country} />
                ))}
              </datalist>
            </div>

            {/* Religious with suggestions (static list) */}
            <div className="flex flex-col w-1/3">
              <label htmlFor="religious" className="text-sm font-medium mb-1">Religious</label>
              <input
                list="religion-options"
                type="text"
                name="religious"
                id="religious"
                placeholder="Religious"
                value={formData.religious || ''}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
              />
              <datalist id="religion-options">
                {[
                  "Buddhism", "Christianity", "Islam", "Hinduism", "Judaism",
                  "Sikhism", "Baháʼí", "Jainism", "Shinto", "Taoism",
                  "Atheist", "Agnostic", "Other"
                ].map((religion) => (
                  <option key={religion} value={religion} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            {/* Current City */}
            <div className="flex flex-col w-1/2">
              <label htmlFor="current_city" className="text-sm font-medium mb-1">Current City</label>
              <input
                type="text"
                name="current_city"
                id="current_city"
                placeholder="Current City"
                value={formData.current_city || ''}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
              />
            </div>

            {/* Current Country with suggestions */}
            <div className="flex flex-col w-1/2">
              <label htmlFor="current_country" className="text-sm font-medium mb-1">Current Country</label>
              <input
                list="country-options"
                type="text"
                name="current_country"
                id="current_country"
                placeholder="Current Country"
                value={formData.current_country || ''}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
              />
              {/* Reusing the same country datalist */}
            </div>
          </div>



                  
          {/* Break Line */}
          <hr className="my-6 border-gray-300" />
          {/* Are you currently a student? */}
          <div className="flex flex-col items-center text-center">
            <label className="text-sm font-medium mb-2">Are you currently a university student?</label>
            <div className="flex gap-4 justify-center">
              {[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
                { value: 'graduate', label: 'Just graduate' },
              ].map(({ value, label }) => (
                <div
                  key={value}
                  onClick={() => {
                    setStudentStatus(value)
                    setFormData((prev) => ({ ...prev, student_status: value }))
                  }}
                  className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 
                    ${studentStatus === value
                      ? "bg-gray-800 text-white shadow-md scale-105"
                      : "border-gray-400 text-gray-800 hover:bg-gray-100"}`}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>


          {studentStatus === 'yes' && (
          <>
            {/* First Row: Degree, Study Year, Major */}
            <div className="flex gap-4">
              {/* Degree */}
              <div className="flex flex-col w-1/4">
                <label htmlFor="degree" className="text-sm font-medium mb-1">Degree</label>
                <select
                  name="degree"
                  id="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md"
                >
                  <option value="">Select</option>
                  <option value="Bachelor">Bachelor</option>
                  <option value="Master">Master</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>

              {/* Study Year */}
              <div className="flex flex-col w-1/4">
                <label htmlFor="study_year" className="text-sm font-medium mb-1">Study Year</label>
                <select
                  name="study_year"
                  id="study_year"
                  value={formData.study_year}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md"
                >
                  <option value="">Year</option>
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>

              {/* Major */}
              <div className="flex flex-col w-1/2">
                <label htmlFor="major" className="text-sm font-medium mb-1">Major</label>
                <input
                  type="text"
                  name="major"
                  id="major"
                  value={formData.major || ''}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md"
                />
              </div>
            </div>

            {/* Second Row: Faculty, University */}
            <div className="flex gap-4 mt-4">
              {/* Faculty */}
              <div className="flex flex-col w-1/2">
                <label htmlFor="faculty" className="text-sm font-medium mb-1">Faculty</label>
                <input
                  type="text"
                  name="faculty"
                  id="faculty"
                  value={formData.faculty || ''}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md"
                />
              </div>

              {/* University */}
              <div className="flex flex-col w-1/2">
                <label htmlFor="university" className="text-sm font-medium mb-1">University</label>
                <input
                  type="text"
                  name="university"
                  id="university"
                  value={formData.university || ''}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md"
                />
              </div>
            </div>
          </>
        )}


        {studentStatus === 'no' && (
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">What do you do?</label>
            <input
              type="text"
              name="occupation"
              value={formData.occupation || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, occupation: e.target.value }))}
              className="border border-gray-300 p-2 rounded-md"
            />
          </div>
        )}

        {studentStatus === 'graduate' && (
          <>
            {/* First Row: Degree, Study Year, Major */}
            <div className="flex gap-4">
              {/* Degree */}
              <div className="flex flex-col w-1/4">
                <label htmlFor="degree" className="text-sm font-medium mb-1">Degree</label>
                <select
                  name="degree"
                  id="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md"
                >
                  <option value="">Select</option>
                  <option value="Bachelor">Bachelor</option>
                  <option value="Master">Master</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>

              {/* Graduate Year */}
              <div className="flex flex-col w-1/4">
                <label htmlFor="study_year" className="text-sm font-medium mb-1">Study Year</label>
                <select
                  name="study_year"
                  id="study_year"
                  value={formData.study_year}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md"
                >
                  <option value="">Year</option>
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>

              {/* Major */}
              <div className="flex flex-col w-1/2">
                <label htmlFor="major" className="text-sm font-medium mb-1">Major</label>
                <input
                  type="text"
                  name="major"
                  id="major"
                  value={formData.major || ''}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md"
                />
              </div>
            </div>

            {/* Second Row: Faculty, University */}
            <div className="flex gap-4 mt-4">
              {/* Faculty */}
              <div className="flex flex-col w-1/2">
                <label htmlFor="faculty" className="text-sm font-medium mb-1">Faculty</label>
                <input
                  type="text"
                  name="faculty"
                  id="faculty"
                  value={formData.faculty || ''}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md"
                />
              </div>

              {/* University */}
              <div className="flex flex-col w-1/2">
                <label htmlFor="university" className="text-sm font-medium mb-1">University</label>
                <input
                  type="text"
                  name="university"
                  id="university"
                  value={formData.university || ''}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md"
                />
              </div>
            </div>
          </>
        )}

          {/* Divider */}
          <hr className="my-6 border-gray-300" />

          {/* 1. How do you know iGEN?
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-2">How did you hear about iGEN?</label>
            <div className="flex flex-wrap gap-3">
              {["Poster", "Social Media", "My Friend", "University", "Website"].map((option) => (
                <div
                  key={option}
                  onClick={() => setFormData((prev) => ({ ...prev, how_know_igen: option }))}
                  className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200
                    ${formData.how_know_igen === option
                      ? "bg-gray-800 text-white shadow-md scale-105"
                      : "border-gray-400 text-gray-800 hover:bg-gray-100"}`}
                >
                  {option}
                </div>
              ))}
            </div>
          </div> */}

          
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-2">Which iGEN group will you join?</label>
            <div className="flex flex-wrap gap-3">
              {["iGEN Global", "Zhong Tham Dee"].map((group) => (
                <div
                  key={group}
                  onClick={() => setFormData((prev) => ({ ...prev, igen_club: group }))}
                  className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200
                    ${formData.igen_club === group
                      ? "bg-gray-800 text-white shadow-md scale-105"
                      : "border-gray-400 text-gray-800 hover:bg-gray-100"}`}
                >
                  {group}
                </div>
              ))}
            </div>
          </div>



          {/* 2. What do you like to do? (chip-style multi-select with inline input) */}
          <div className="flex flex-col mt-6">
            <label className="text-sm font-medium mb-2">What do you like to do?</label>
            <div className="flex flex-wrap gap-3">
              {[
                ...["Reading", "Drawing", "Running", "Gaming", "Music", "Writing"],
                ...customInterests.filter(
                  (i) => !["Reading", "Drawing", "Running", "Gaming", "Music", "Writing"].includes(i)
                ),
              ].map((interest) => {
                const selected = formData.interests.includes(interest)
                return (
                  <div
                    key={interest}
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        interests: selected
                          ? prev.interests.filter((i) => i !== interest)
                          : [...prev.interests, interest],
                      }))
                    }}
                    className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200
                      ${selected
                        ? "bg-gray-800 text-white shadow-md scale-105"
                        : "border-gray-400 text-gray-800 hover:bg-gray-100"}`}
                  >
                    {interest}
                  </div>
                )
              })}

              {/* Inline input styled as chip */}
              <input
                type="text"
                placeholder="Add..."
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customInterest.trim()) {
                    e.preventDefault()
                    const newInterest = customInterest.trim()
                    if (
                      !formData.interests.includes(newInterest) &&
                      !customInterests.includes(newInterest)
                    ) {
                      setCustomInterests([...customInterests, newInterest])
                      setFormData((prev) => ({
                        ...prev,
                        interests: [...prev.interests, newInterest],
                      }))
                    }
                    setCustomInterest('')
                  }
                }}
                className="px-4 py-2 rounded-full text-sm font-medium border border-dashed border-gray-400 w-28 transition focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
          </div>


          <div className="flex gap-4 mt-6">
            {/* Email */}
            <div className="flex flex-col w-1/2">
              <label htmlFor="email" className="text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
                required
              />
            </div>

            {/* Phone (with react-phone-input-2) */}
            {/* Phone */}
            <div className="flex flex-col w-1/2">
              <label htmlFor="telephone" className="text-sm font-medium mb-1">Phone Number</label>
              <PhoneInput
                inputProps={{
                  name: 'telephone',
                  id: 'telephone',
                  required: true,
                }}
                country={'th'}
                value={formData.telephone}
                onChange={(phone: string, country: { dialCode: string }) => {
                  const dialCode = country.dialCode;
                  const numberPart = phone.replace(`+${dialCode}`, '');

                  if (/^[0-9]*$/.test(numberPart) && numberPart.length <= 10) {
                    setFormData((prev) => ({ ...prev, telephone: phone }))
                    setPhoneError(null)
                  } else {
                    setPhoneError("Only numbers allowed, up to 10 digits after country code")
                  }
                }}
                inputClass="!w-full !pl-12 !pr-2 !py-2 !border !border-gray-300 !rounded-md text-sm"
                buttonClass="!border-gray-300"
                containerClass="!w-full"
              />
              {phoneError && (
                <p className="text-sm text-red-500 mt-1">{phoneError}</p>
              )}

            </div>
          </div>
          {/* Username + Password in the same row */}
          <div className="flex gap-4 mt-6">
            {/* Username */}
            <div className="flex flex-col w-1/2">
              <label htmlFor="username" className="text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                onBlur={() => validateUsername(formData.username)}
                className="border border-gray-300 p-2 rounded-md"
              />
              {usernameError && (
                <p className="text-sm text-red-500 mt-1">{usernameError}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col w-1/2">
              <label htmlFor="password" className="text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
                required
              />
            </div>
          </div>


          
          
          {error && <p className="text-red-500">{error}</p>}
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
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
          {/* <button
            type="submit"
            className="bg-green-600 text-white py-2 px-4 rounded-md w-full hover:bg-green-700 transition-colors"
          >
            Sign Up
          </button> */}
        </form>
      </div>
      </div>
  );
}
