import MainNavLayout from '@/components/MainNavLayout'

export default function JoinUs() {
  return (
    <MainNavLayout>
      <h1 className="text-4xl font-bold mb-6 text-center">Join Us</h1>
      <p className="text-lg text-center text-gray-700 mb-6">
        We&apos;re a youth volunteer network that connects passionate students and communities together
        through meaningful activities and projects.
      </p>
      <div className="text-center">
        <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
          Explore Activities
        </button>
      </div>
    </MainNavLayout>
  )
}