'use client'

import { ServiceCards } from '@/components/ServiceCards'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <main className="flex flex-col items-center px-4 py-16 max-w-5xl mx-auto">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-semibold mb-3">A Legacy of Love and Light</h1>
        <p className="text-lg text-light-textSecondary dark:text-dark-textSecondary mb-8 max-w-xl">
          Create a private, meaningful space to honor your loved one.
          Preserve memories, hear their voice, and find comfort.
        </p>
        <button className="bg-light-primaryButton text-light-buttonText dark:bg-dark-primaryButton dark:text-dark-buttonText font-medium py-3 px-6 rounded-lg shadow-md transition-transform hover:scale-105">
          Create Memorial
        </button>
      </motion.div>
      <ServiceCards />
    </main>
  )
}
