'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { useParams } from 'next/navigation'
import { CldImage } from 'next-cloudinary'
import toast from 'react-hot-toast'
import { Send } from 'lucide-react'
import Link from 'next/link'

// Guestbook Entry Component
function Letter({ letter }) {
  return (
    <div className="bg-light-surface dark:bg-dark-surface p-4 rounded-lg border border-light-border dark:border-dark-border">
      <p className="text-light-textSecondary dark:text-dark-textSecondary mb-2">
        {letter.message}
      </p>
      <span className="text-sm font-medium text-light-accent dark:text-dark-accent">
        - {letter.author_name || 'A Friend'}
      </span>
    </div>
  )
}

export default function MemorialPage() {
  const [memorial, setMemorial] = useState(null)
  const [photos, setPhotos] = useState([])
  const [letters, setLetters] = useState([])
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [posting, setPosting] = useState(false)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)

  const supabase = createClient()
  const params = useParams()
  const { id: memorialId } = params

  // Fetch all data for the memorial
  useEffect(() => {
    if (!memorialId) return

    const fetchMemorialData = async () => {
      setLoading(true)

      // 1. Get current logged-in user (if any)
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data: profileData } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()
        setProfile(profileData)
        if (profileData) setNewAuthor(profileData.full_name)
      }

      // 2. Fetch the memorial details
      const { data: memorialData, error: memorialError } = await supabase
        .from('memorials')
        .select('*')
        .eq('id', memorialId)
        .single()

      if (memorialError || !memorialData) {
        toast.error('Memorial not found or you do not have access.')
        setLoading(false)
        return
      }
      setMemorial(memorialData)

      // 3. Fetch gallery photos
      const { data: photosData } = await supabase
        .from('gallery_photos')
        .select('*')
        .eq('memorial_id', memorialId)
        .order('created_at', { ascending: false })
      setPhotos(photosData || [])

      // 4. Fetch guestbook letters
      const { data: lettersData } = await supabase
        .from('guestbook_entries')
        .select('*')
        .eq('memorial_id', memorialId)
        .order('created_at', { ascending: false })
      setLetters(lettersData || [])

      setLoading(false)
    }

    fetchMemorialData()
  }, [memorialId, supabase])

  // --- Handle Guestbook (Letters of Love) Post ---
  const handlePostLetter = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !newAuthor.trim()) {
      return toast.error('Please fill in your name and a message.')
    }
    if (!user) {
      return toast.error('You must be logged in to leave a message.')
    }

    setPosting(true)
    const toastId = toast.loading('Posting message...')

    const { data: newEntry, error } = await supabase
      .from('guestbook_entries')
      .insert({
        memorial_id: memorialId,
        author_id: user.id,
        author_name: newAuthor,
        message: newMessage,
      })
      .select()
      .single()

    if (error) {
      toast.dismiss(toastId)
      toast.error(`Error: ${error.message}`)
    } else {
      toast.dismiss(toastId)
      toast.success('Your letter has been posted.')
      setLetters([newEntry, ...letters]) // Add to UI instantly
      setNewMessage('')
    }
    setPosting(false)
  }

  if (loading) {
    return <div className="text-center py-16">Loading Memorial...</div>
  }
  if (!memorial) {
    return <div className="text-center py-16">Memorial not found.</div>
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-16">
      {/* --- 1. Biography Section --- */}
      <section className="text-center">
        <h1 className="text-4xl font-semibold mb-4">{memorial.name}</h1>
        <p className="text-lg text-light-textSecondary dark:text-dark-textSecondary whitespace-pre-line max-w-3xl mx-auto">
          {memorial.bio || 'No biography written yet.'}
        </p>
      </section>

      {/* --- 2. Memory Lane (Gallery) --- */}
      <section>
        <h2 className="text-3xl font-semibold text-center mb-8">Memory Lane</h2>
        {photos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="rounded-lg overflow-hidden shadow-lg">
                <CldImage
                  width="500"
                  height="500"
                  src={photo.image_url} // This is the Cloudinary Public ID
                  alt={photo.caption || 'Memorial photo'}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-light-textSecondary dark:text-dark-textSecondary">
            No photos have been added yet.
          </p>
        )}
      </section>

      {/* --- 3. Letters of Love (Guestbook) --- */}
      <section className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-8">Letters of Love</h2>
        
        {/* Guestbook Form (Only for logged-in users) */}
        {user ? (
          <form onSubmit={handlePostLetter} className="mb-8 p-4 bg-light-surface dark:bg-dark-surface rounded-lg border border-light-border dark:border-dark-border">
            <input
              type="text"
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              placeholder="Your Name"
              className="w-full p-2 mb-2 rounded-lg bg-light-background dark:bg-dark-background border border-light-border dark:border-dark-border"
              required
              disabled={!!profile} // Disable if they have a profile name
            />
            <textarea
              rows={3}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Leave a message or share a memory..."
              className="w-full p-2 mb-2 rounded-lg bg-light-background dark:bg-dark-background border border-light-border dark:border-dark-border"
              required
            />
            <button
              type="submit"
              disabled={posting}
              className="w-full flex justify-center items-center gap-2 bg-light-primaryButton text-light-buttonText dark:bg-dark-primaryButton dark:text-dark-buttonText font-medium py-2 px-4 rounded-lg disabled:opacity-50"
            >
              {posting ? 'Posting...' : <><Send size={16} /> Post Letter</>}
            </button>
          </form>
        ) : (
          <p className="text-center text-light-textSecondary dark:text-dark-textSecondary mb-8">
            Please <Link href="/login" className="underline text-light-accent dark:text-dark-accent">log in</Link> to leave a letter.
          </p>
        )}

        {/* Guestbook List */}
        <div className="space-y-4">
          {letters.length > 0 ? (
            letters.map((letter) => <Letter key={letter.id} letter={letter} />)
          ) : (
            <p className="text-center text-light-textSecondary dark:text-dark-textSecondary">
              Be the first to leave a letter.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
