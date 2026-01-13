'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function MemorialHero({ memorial }) {
    if (!memorial) return null;

    const { name, dateOfBirth, dateOfPassing, mainPhoto, quote, biography } = memorial;

    // Format dates elegantly
    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const birthYear = dateOfBirth ? new Date(dateOfBirth).getFullYear() : '';
    const passingYear = dateOfPassing ? new Date(dateOfPassing).getFullYear() : '';

    return (
        <section className="relative w-full">
            {/* Hero Image with Gradient Overlay */}
            <div className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
                {mainPhoto && (
                    <Image
                        src={mainPhoto}
                        alt={name || 'Memorial photo'}
                        fill
                        priority
                        className="object-cover blur-up"
                        style={{
                            filter: 'brightness(0.85) saturate(0.9)',
                        }}
                    />
                )}

                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />

                {/* Hero Content - Centered */}
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 md:pb-16 lg:pb-20 px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-4xl"
                    >
                        {/* Name */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-3 md:mb-4 drop-shadow-lg">
                            {name}
                        </h1>

                        {/* Life Dates */}
                        <div className="flex items-center justify-center gap-3 mb-6 md:mb-8">
                            <time
                                dateTime={dateOfBirth}
                                className="text-lg md:text-xl text-white/90 drop-shadow-md"
                            >
                                {birthYear}
                            </time>
                            <span className="text-white/70 text-2xl">—</span>
                            <time
                                dateTime={dateOfPassing}
                                className="text-lg md:text-xl text-white/90 drop-shadow-md"
                            >
                                {passingYear}
                            </time>
                        </div>

                        {/* Quote */}
                        {quote && (
                            <motion.blockquote
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="text-base md:text-lg lg:text-xl text-white/95 italic font-serif max-w-2xl mx-auto drop-shadow-md"
                            >
                                "{quote}"
                            </motion.blockquote>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Biography Section - Below Hero */}
            {biography && (
                <div className="bg-memorial-surface dark:bg-memorialDark-surface">
                    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-2xl md:text-3xl font-serif text-memorial-text dark:text-memorialDark-text mb-6 text-center">
                                In Loving Memory
                            </h2>
                            <div
                                className="text-base md:text-base-desktop leading-relaxed text-memorial-textSecondary dark:text-memorialDark-textSecondary text-center max-w-3xl mx-auto"
                                style={{ whiteSpace: 'pre-wrap' }}
                            >
                                {biography}
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </section>
    );
}
