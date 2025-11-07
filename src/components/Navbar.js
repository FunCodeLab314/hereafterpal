'use client'

import { useState, useEffect } from 'react'
import { ThemeToggle } from './ThemeToggle'
import { MessageSquareHeart, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase])

  const closeMenu = () => setIsOpen(false)

  const handleSignOut = async () => {
    closeMenu()
    const toastId = toast.loading('Signing out...')
    await supabase.auth.signOut()
    toast.dismiss(toastId)
    toast.success('Signed out successfully!')
    router.push('/')
    router.refresh()
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/pricing', label: 'Pricing' },
  ]

  const userLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/account', label: 'Account' },
  ]

  return (
    <nav className="relative w-full max-w-5xl mx-auto px-4 py-4 z-50">
      <div className="flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
          <MessageSquareHeart size={28} className="text-light-accent dark:text-dark-accent" />
          <span className="font-semibold text-xl">Hereafter, Pal</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary hover:text-light-textPrimary dark:hover:text-dark-textPrimary transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {!loading && (
            user ? (
              <>
                {userLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary hover:text-light-textPrimary dark:hover:text-dark-textPrimary transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={handleSignOut}
                  className="text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary hover:text-light-textPrimary dark:hover:text-dark-textPrimary transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium bg-light-primaryButton text-light-buttonText dark:bg-dark-primaryButton dark:text-dark-buttonText px-3 py-1.5 rounded-lg"
              >
                Log In
              </Link>
            )
          )}
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            className="md:hidden p-2 rounded-lg"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-0 right-0 mx-4 mt-2 bg-light-surface dark:bg-dark-surface rounded-lg shadow-xl border border-light-border dark:border-dark-border"
          >
            <div className="flex flex-col p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="p-3 text-sm font-medium rounded-md hover:bg-light-background dark:hover:bg-dark-background"
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-light-border dark:border-dark-border my-2"></div>
              {!loading && (
                user ? (
                  <>
                    {userLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="p-3 text-sm font-medium rounded-md hover:bg-light-background dark:hover:bg-dark-background"
                        onClick={closeMenu}
                      >
                        {link.label}
                      </Link>
                    ))}
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left p-3 text-sm font-medium rounded-md text-red-500 hover:bg-light-background dark:hover:bg-dark-background"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="mt-2 text-center p-3 text-sm font-medium rounded-md bg-light-primaryButton text-light-buttonText dark:bg-dark-primaryButton dark:text-dark-buttonText"
                    onClick={closeMenu}
                  >
                    Log In
                  </Link>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

