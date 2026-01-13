'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Heart } from 'lucide-react';

export default function Guestbook({ messages, onSubmit, isLoading }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.message.trim()) {
            return;
        }

        setIsSubmitting(true);

        try {
            await onSubmit(formData);
            // Reset form on success
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error('Error submitting message:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="w-full">
            {/* Add Message Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="memorial-card p-4 md:p-6 mb-8 md:mb-12"
            >
                <h3 className="text-xl md:text-2xl font-serif text-memorial-text dark:text-memorialDark-text mb-4 flex items-center gap-2">
                    <Heart size={24} className="text-memorial-gold dark:text-memorialDark-gold" />
                    Share a Memory
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Input */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-memorial-textSecondary dark:text-memorialDark-textSecondary mb-2"
                        >
                            Your Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-memorial bg-memorial-bg dark:bg-memorialDark-bg border border-memorial-divider dark:border-memorialDark-divider text-memorial-text dark:text-memorialDark-text focus:border-memorial-gold dark:focus:border-memorialDark-gold transition-colors duration-200 min-h-touch"
                            placeholder="Enter your name"
                        />
                    </div>

                    {/* Email Input (Optional) */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-memorial-textSecondary dark:text-memorialDark-textSecondary mb-2"
                        >
                            Email (optional)
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-memorial bg-memorial-bg dark:bg-memorialDark-bg border border-memorial-divider dark:border-memorialDark-divider text-memorial-text dark:text-memorialDark-text focus:border-memorial-gold dark:focus:border-memorialDark-gold transition-colors duration-200 min-h-touch"
                            placeholder="your.email@example.com"
                        />
                    </div>

                    {/* Message Textarea */}
                    <div>
                        <label
                            htmlFor="message"
                            className="block text-sm font-medium text-memorial-textSecondary dark:text-memorialDark-textSecondary mb-2"
                        >
                            Your Message *
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows="4"
                            className="w-full px-4 py-3 rounded-memorial bg-memorial-bg dark:bg-memorialDark-bg border border-memorial-divider dark:border-memorialDark-divider text-memorial-text dark:text-memorialDark-text focus:border-memorial-gold dark:focus:border-memorialDark-gold transition-colors duration-200 resize-vertical"
                            placeholder="Share a memory, thought, or message of condolence..."
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting || !formData.name.trim() || !formData.message.trim()}
                        className="w-full md:w-auto px-8 py-3 bg-memorial-gold dark:bg-memorialDark-gold text-white rounded-memorial hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 min-h-touch font-medium active:scale-98"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send size={18} />
                                Share Message
                            </>
                        )}
                    </button>
                </form>
            </motion.div>

            {/* Messages List */}
            <div className="space-y-4 md:space-y-6">
                {isLoading ? (
                    <div className="text-center py-8">
                        <div className="inline-block w-8 h-8 border-4 border-memorial-gold/30 border-t-memorial-gold dark:border-memorialDark-gold/30 dark:border-t-memorialDark-gold rounded-full animate-spin" />
                        <p className="mt-4 text-memorial-textSecondary dark:text-memorialDark-textSecondary">
                            Loading messages...
                        </p>
                    </div>
                ) : messages && messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <motion.div
                            key={msg.id || index}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className="memorial-card p-4 md:p-6"
                        >
                            {/* Author Info */}
                            <div className="flex items-start gap-3 mb-3">
                                {/* Profile Picture (Optional) */}
                                {msg.profilePicture && (
                                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                        <img
                                            src={msg.profilePicture}
                                            alt={msg.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <h4 className="font-medium text-memorial-text dark:text-memorialDark-text truncate">
                                            {msg.name}
                                        </h4>
                                        <time
                                            dateTime={msg.createdAt}
                                            className="text-xs text-memorial-textSecondary dark:text-memorialDark-textSecondary whitespace-nowrap"
                                        >
                                            {new Date(msg.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </time>
                                    </div>
                                    <p className="text-sm md:text-base text-memorial-textSecondary dark:text-memorialDark-textSecondary leading-relaxed whitespace-pre-wrap">
                                        {msg.message}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-12 text-memorial-textSecondary dark:text-memorialDark-textSecondary">
                        <Heart size={48} className="mx-auto mb-4 opacity-30" />
                        <p>Be the first to share a memory</p>
                    </div>
                )}
            </div>
        </div>
    );
}
