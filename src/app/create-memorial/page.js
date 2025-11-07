'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function CreateMemorialPage() {
  const supabase = createClient()
  const router = useRouter()
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [serviceType, setServiceType] = useState('ETERNAL ECHO')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const toastId = toast.loading('Creating memorial...')

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      toast.error('You must be logged in.')
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('memorials')
      .insert({
        name: name,
        bio: bio,
        service_type: serviceType,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) {
      toast.dismiss(toastId)
      toast.error(`Error: ${error.message}`)
    } else {
      toast.dismiss(toastId)
      toast.success('Memorial created successfully!')
      router.push(`/dashboard`)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold text-center mb-8">Create a New Memorial</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-light-surface dark:bg-dark-surface p-8 rounded-2xl shadow-lg border border-light-border dark:border-dark-border space-y-6"
      >
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">
            Name of Loved One
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded-lg bg-light-background dark:bg-dark-background border border-light-border dark:border-dark-border"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="serviceType">
            Memorial Type
          </label>
          <select
            id="serviceType"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            className="w-full p-2 rounded-lg bg-light-background dark:bg-dark-background border border-light-border dark:border-dark-border"
          >
            <option value="ETERNAL ECHO">Eternal Echo (Human)</option>
            <option value="PAWS">Paws But Not Forgotten (Pet)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="bio">
            Biography or Tribute
          </label>
          <textarea
            id="bio"
            rows={8}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-2 rounded-lg bg-light-background dark:bg-dark-background border border-light-border dark:border-dark-border"
            placeholder="Write a few words about your loved one..."
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-light-primaryButton text-light-buttonText dark:bg-dark-primaryButton dark:text-dark-buttonText font-medium py-2.5 px-4 rounded-lg disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Create Memorial'}
        </button>
      </form>
    </div>
  )
}

