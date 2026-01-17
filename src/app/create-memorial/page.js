'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Upload, X, AlertCircle, Check, ImagePlus } from 'lucide-react'
import { motion } from 'framer-motion'
import { CldUploadButton, CldImage } from 'next-cloudinary'

export default function CreateMemorialPage() {
  const supabase = createClient()
  const router = useRouter()

  // Form state
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [serviceType, setServiceType] = useState('Memorial Service')
  const [visibility, setVisibility] = useState('private')
  const [loading, setLoading] = useState(false)

  // Cloudinary image state - stores the public_id from Cloudinary
  const [imagePublicId, setImagePublicId] = useState(null)

  // Date state - separate fields for better control
  const [birthMonth, setBirthMonth] = useState('')
  const [birthDay, setBirthDay] = useState('')
  const [birthYear, setBirthYear] = useState('')
  const [deathMonth, setDeathMonth] = useState('')
  const [deathDay, setDeathDay] = useState('')
  const [deathYear, setDeathYear] = useState('')

  // Validation errors
  const [errors, setErrors] = useState({})

  // Character count for bio
  const maxBioLength = 5000
  const minBioLength = 50
  const bioLength = bio.length

  // Months for dropdown
  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ]

  // Days for dropdown (1-31)
  const days = Array.from({ length: 31 }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: String(i + 1),
  }))

  // Current year for validation
  const currentYear = new Date().getFullYear()

  // Calculate age if both dates are complete
  const calculateAge = () => {
    if (birthYear && deathYear && birthMonth && deathMonth) {
      let age = parseInt(deathYear) - parseInt(birthYear)
      if (parseInt(deathMonth) < parseInt(birthMonth)) {
        age--
      } else if (parseInt(deathMonth) === parseInt(birthMonth) && parseInt(deathDay) < parseInt(birthDay)) {
        age--
      }
      return age >= 0 ? age : null
    }
    return null
  }

  const age = calculateAge()

  // Handle Cloudinary upload success
  const handleUploadSuccess = (result) => {
    if (result?.info?.public_id) {
      setImagePublicId(result.info.public_id)
      setErrors(prev => ({ ...prev, image: null }))
      toast.success('Photo uploaded successfully!')
    }
  }

  // Remove uploaded image
  const removeImage = () => {
    setImagePublicId(null)
  }

  // Validate form fields
  const validateForm = () => {
    const newErrors = {}

    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Please enter a name (required)'
    } else if (name.length > 100) {
      newErrors.name = 'Name must be 100 characters or less'
    }

    // Birth date validation
    if (!birthMonth || !birthDay || !birthYear) {
      newErrors.birthDate = 'Please enter a complete birth date'
    } else {
      const birthYearNum = parseInt(birthYear)
      if (birthYearNum < 1800 || birthYearNum > currentYear) {
        newErrors.birthDate = `Birth year must be between 1800 and ${currentYear}`
      }
      const birthDate = new Date(birthYearNum, parseInt(birthMonth) - 1, parseInt(birthDay))
      if (birthDate > new Date()) {
        newErrors.birthDate = 'Birth date cannot be in the future'
      }
    }

    // Death date validation
    if (!deathMonth || !deathDay || !deathYear) {
      newErrors.deathDate = 'Please enter a complete date of passing'
    } else {
      const deathYearNum = parseInt(deathYear)
      const birthYearNum = parseInt(birthYear)

      if (deathYearNum < 1800 || deathYearNum > currentYear) {
        newErrors.deathDate = `Year must be between 1800 and ${currentYear}`
      }

      if (birthYear && deathYearNum < birthYearNum) {
        newErrors.deathDate = 'Date of passing must be after birth date'
      }

      const deathDate = new Date(deathYearNum, parseInt(deathMonth) - 1, parseInt(deathDay))
      if (deathDate > new Date()) {
        newErrors.deathDate = 'Date of passing cannot be in the future'
      }

      if (birthYear && birthMonth && birthDay) {
        const birthDate = new Date(parseInt(birthYear), parseInt(birthMonth) - 1, parseInt(birthDay))
        if (deathDate < birthDate) {
          newErrors.deathDate = 'Date of passing must be after birth date'
        }
      }
    }

    // Bio validation
    if (!bio.trim()) {
      newErrors.bio = 'Please write a life story (required)'
    } else if (bio.length < minBioLength) {
      newErrors.bio = `Please write at least ${minBioLength} characters`
    } else if (bio.length > maxBioLength) {
      newErrors.bio = `Life story must be ${maxBioLength} characters or less`
    }

    // Image validation
    if (!imagePublicId) {
      newErrors.image = 'Please upload a photo'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please fix the errors before submitting')
      return
    }

    setLoading(true)
    const toastId = toast.loading('Creating memorial...')

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.dismiss(toastId)
        toast.error('You must be logged in.')
        router.push('/login')
        return
      }

      // Construct full dates in YYYY-MM-DD format
      const dateOfBirth = `${birthYear}-${birthMonth}-${birthDay}`
      const dateOfPassing = `${deathYear}-${deathMonth}-${deathDay}`

      // Create memorial record with Cloudinary public_id as image_url
      const { data, error } = await supabase
        .from('memorials')
        .insert({
          name: name.trim(),
          bio: bio.trim(),
          service_type: serviceType,
          visibility: visibility,
          image_url: imagePublicId, // Store Cloudinary public_id
          user_id: user.id,
          date_of_birth: dateOfBirth,
          date_of_passing: dateOfPassing,
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      toast.dismiss(toastId)
      toast.success('Memorial created successfully! ✓', {
        icon: '💐',
        style: {
          background: '#FAF9F7',
          color: '#2C2C2C',
        },
      })
      router.push('/dashboard')
    } catch (error) {
      toast.dismiss(toastId)
      toast.error(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Year input handler with validation
  const handleYearInput = (value, setter, fieldName) => {
    const numericValue = value.replace(/\D/g, '')
    if (numericValue.length <= 4) {
      setter(numericValue)
      if (errors[fieldName]) {
        setErrors(prev => ({ ...prev, [fieldName]: null }))
      }
    }
  }

  // Input class helper
  const inputClasses = (hasError) => `
    w-full px-4 py-3 rounded-memorial 
    bg-memorial-bg dark:bg-memorialDark-bg 
    border ${hasError ? 'border-red-500' : 'border-memorial-divider dark:border-memorialDark-divider'}
    text-memorial-text dark:text-memorialDark-text
    focus:border-memorial-gold dark:focus:border-memorialDark-gold 
    focus:ring-2 focus:ring-memorial-gold/20
    transition-colors duration-200
    min-h-touch
    text-base
  `

  const selectClasses = (hasError) => `
    px-3 py-3 rounded-memorial 
    bg-memorial-bg dark:bg-memorialDark-bg 
    border ${hasError ? 'border-red-500' : 'border-memorial-divider dark:border-memorialDark-divider'}
    text-memorial-text dark:text-memorialDark-text
    focus:border-memorial-gold dark:focus:border-memorialDark-gold 
    transition-colors duration-200
    min-h-touch
    text-base
    appearance-none
  `

  return (
    <div className="min-h-screen bg-memorial-bg dark:bg-memorialDark-bg py-8 md:py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-serif text-memorial-text dark:text-memorialDark-text mb-3">
            Create a Memorial
          </h1>
          <p className="text-memorial-textSecondary dark:text-memorialDark-textSecondary">
            Honor your loved one with a beautiful, lasting tribute
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="memorial-card p-6 md:p-8 space-y-8"
        >
          {/* Photo Upload - Using Cloudinary */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-memorial-text dark:text-memorialDark-text">
              Profile Photo <span className="text-red-500">*</span>
            </label>

            <div className="flex flex-col items-center gap-4">
              {/* Photo Preview */}
              <div
                className={`relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 ${errors.image ? 'border-red-500' : 'border-memorial-gold/30 dark:border-memorialDark-gold/30'
                  } bg-memorial-bg dark:bg-memorialDark-bg flex items-center justify-center`}
              >
                {imagePublicId ? (
                  <>
                    <CldImage
                      src={imagePublicId}
                      width={160}
                      height={160}
                      alt="Memorial photo"
                      crop="fill"
                      gravity="face"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <ImagePlus size={32} className="mx-auto text-memorial-textSecondary dark:text-memorialDark-textSecondary mb-2" />
                    <span className="text-sm text-memorial-textSecondary dark:text-memorialDark-textSecondary">
                      No photo
                    </span>
                  </div>
                )}
              </div>

              {/* Cloudinary Upload Button */}
              <CldUploadButton
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                onSuccess={handleUploadSuccess}
                className="px-6 py-3 rounded-memorial bg-memorial-gold dark:bg-memorialDark-gold text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2 min-h-touch"
              >
                <Upload size={18} />
                {imagePublicId ? 'Change Photo' : 'Upload Photo'}
              </CldUploadButton>

              <p className="text-xs text-memorial-textSecondary dark:text-memorialDark-textSecondary">
                JPG, PNG or WebP (Max 10MB)
              </p>
            </div>

            {errors.image && (
              <p className="text-sm text-red-500 flex items-center justify-center gap-1">
                <AlertCircle size={14} />
                {errors.image}
              </p>
            )}
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-memorial-text dark:text-memorialDark-text">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name) setErrors(prev => ({ ...prev, name: null }))
              }}
              className={inputClasses(errors.name)}
              placeholder="Enter full name"
              maxLength={100}
            />
            {errors.name && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.name}
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-memorial-text dark:text-memorialDark-text">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              <select
                value={birthMonth}
                onChange={(e) => {
                  setBirthMonth(e.target.value)
                  if (errors.birthDate) setErrors(prev => ({ ...prev, birthDate: null }))
                }}
                className={selectClasses(errors.birthDate)}
              >
                <option value="">Month</option>
                {months.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
              <select
                value={birthDay}
                onChange={(e) => {
                  setBirthDay(e.target.value)
                  if (errors.birthDate) setErrors(prev => ({ ...prev, birthDate: null }))
                }}
                className={selectClasses(errors.birthDate)}
              >
                <option value="">Day</option>
                {days.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={birthYear}
                onChange={(e) => handleYearInput(e.target.value, setBirthYear, 'birthDate')}
                placeholder="Year"
                className={selectClasses(errors.birthDate)}
                maxLength={4}
              />
            </div>
            {errors.birthDate && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.birthDate}
              </p>
            )}
          </div>

          {/* Date of Passing */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-memorial-text dark:text-memorialDark-text">
              Date of Passing <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              <select
                value={deathMonth}
                onChange={(e) => {
                  setDeathMonth(e.target.value)
                  if (errors.deathDate) setErrors(prev => ({ ...prev, deathDate: null }))
                }}
                className={selectClasses(errors.deathDate)}
              >
                <option value="">Month</option>
                {months.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
              <select
                value={deathDay}
                onChange={(e) => {
                  setDeathDay(e.target.value)
                  if (errors.deathDate) setErrors(prev => ({ ...prev, deathDate: null }))
                }}
                className={selectClasses(errors.deathDate)}
              >
                <option value="">Day</option>
                {days.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={deathYear}
                onChange={(e) => handleYearInput(e.target.value, setDeathYear, 'deathDate')}
                placeholder="Year"
                className={selectClasses(errors.deathDate)}
                maxLength={4}
              />
            </div>
            {errors.deathDate && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.deathDate}
              </p>
            )}
            {/* Age calculation */}
            {age !== null && age >= 0 && (
              <p className="text-sm text-memorial-gold dark:text-memorialDark-gold flex items-center gap-1">
                <Check size={14} />
                Lived {age} year{age !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Life Story / Biography */}
          <div className="space-y-2">
            <label htmlFor="bio" className="block text-sm font-medium text-memorial-text dark:text-memorialDark-text">
              Life Story / Biography <span className="text-red-500">*</span>
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => {
                if (e.target.value.length <= maxBioLength) {
                  setBio(e.target.value)
                  if (errors.bio) setErrors(prev => ({ ...prev, bio: null }))
                }
              }}
              rows={8}
              className={`${inputClasses(errors.bio)} resize-y min-h-[150px] md:min-h-[200px] max-h-[500px]`}
              placeholder="Share the story of their life - their passions, achievements, cherished moments, and the legacy they leave behind..."
              style={{ lineHeight: '1.6' }}
            />
            <div className="flex justify-between items-start">
              <div>
                {errors.bio ? (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.bio}
                  </p>
                ) : (
                  <p className="text-xs text-memorial-textSecondary dark:text-memorialDark-textSecondary">
                    💡 Share stories, qualities, and special moments that made them unique.
                  </p>
                )}
              </div>
              <span className={`text-sm ${bioLength < minBioLength ? 'text-memorial-textSecondary' : bioLength > maxBioLength - 100 ? 'text-orange-500' : 'text-memorial-gold'}`}>
                {bioLength} / {maxBioLength}
              </span>
            </div>
          </div>

          {/* Service Type */}
          <div className="space-y-2">
            <label htmlFor="serviceType" className="block text-sm font-medium text-memorial-text dark:text-memorialDark-text">
              Service Type
            </label>
            <select
              id="serviceType"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className={`w-full ${selectClasses(false)}`}
            >
              <option value="Memorial Service">Memorial Service</option>
              <option value="Funeral">Funeral</option>
              <option value="Celebration of Life">Celebration of Life</option>
              <option value="Private">Private</option>
              <option value="ETERNAL ECHO">Eternal Echo (Human)</option>
              <option value="PAWS">Paws But Not Forgotten (Pet)</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Visibility */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-memorial-text dark:text-memorialDark-text">
              Visibility <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-4 rounded-memorial border border-memorial-divider dark:border-memorialDark-divider cursor-pointer hover:border-memorial-gold dark:hover:border-memorialDark-gold transition-colors">
                <input
                  type="radio"
                  name="visibility"
                  value="public"
                  checked={visibility === 'public'}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="mt-0.5 w-4 h-4 text-memorial-gold focus:ring-memorial-gold"
                />
                <div>
                  <span className="block font-medium text-memorial-text dark:text-memorialDark-text">Public</span>
                  <span className="text-sm text-memorial-textSecondary dark:text-memorialDark-textSecondary">
                    Anyone can view this memorial
                  </span>
                </div>
              </label>
              <label className="flex items-start gap-3 p-4 rounded-memorial border border-memorial-divider dark:border-memorialDark-divider cursor-pointer hover:border-memorial-gold dark:hover:border-memorialDark-gold transition-colors">
                <input
                  type="radio"
                  name="visibility"
                  value="private"
                  checked={visibility === 'private'}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="mt-0.5 w-4 h-4 text-memorial-gold focus:ring-memorial-gold"
                />
                <div>
                  <span className="block font-medium text-memorial-text dark:text-memorialDark-text">Private</span>
                  <span className="text-sm text-memorial-textSecondary dark:text-memorialDark-textSecondary">
                    Only you can view this memorial
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4 border-t border-memorial-divider dark:border-memorialDark-divider">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full sm:w-auto px-6 py-3 rounded-memorial border border-memorial-divider dark:border-memorialDark-divider text-memorial-text dark:text-memorialDark-text hover:bg-memorial-bg dark:hover:bg-memorialDark-bg transition-colors duration-200 font-medium min-h-touch"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:flex-1 px-6 py-3 rounded-memorial bg-memorial-gold dark:bg-memorialDark-gold text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium min-h-touch flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Memorial'
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  )
}
