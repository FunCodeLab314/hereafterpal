'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, Camera, BookOpen, MessageCircle, Plus, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function QuickActions() {
    const { navigateToCreateMemorial } = useAuth();

    const actions = [
        {
            id: 'create',
            title: 'Create Memorial',
            description: 'Honor a loved one',
            icon: Plus,
            href: '/create-memorial',
            primary: true,
            requiresAuth: true, // This action requires authentication
        },
        {
            id: 'photos',
            title: 'View Photos',
            description: 'Cherished moments',
            icon: Camera,
            href: '#photos',
        },
        {
            id: 'stories',
            title: 'Read Stories',
            description: 'Life memories',
            icon: BookOpen,
            href: '#stories',
        },
        {
            id: 'guestbook',
            title: 'Sign Guestbook',
            description: 'Share a memory',
            icon: MessageCircle,
            href: '#guestbook',
        },
    ];

    const handleActionClick = (e, action) => {
        if (action.requiresAuth) {
            e.preventDefault();
            navigateToCreateMemorial();
        }
    };

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-6">
            {actions.map((action, index) => {
                const Icon = action.icon;

                return (
                    <motion.div
                        key={action.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                        {action.requiresAuth ? (
                            <button
                                onClick={(e) => handleActionClick(e, action)}
                                className={`block w-full memorial-card p-6 min-h-touch transition-all duration-300 group ${action.primary
                                    ? 'bg-memorial-accent dark:bg-memorialDark-accent text-white dark:text-memorialDark-bg hover:shadow-memorial-lg'
                                    : 'hover:border-memorial-accent dark:hover:border-memorialDark-accent border border-transparent'
                                    }`}
                            >
                                <div className="flex flex-col items-center text-center gap-3">
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${action.primary
                                            ? 'bg-white/20'
                                            : 'bg-memorial-accent/10 dark:bg-memorialDark-accent/10'
                                            }`}
                                    >
                                        <Icon
                                            size={24}
                                            className={
                                                action.primary
                                                    ? 'text-white dark:text-memorialDark-bg'
                                                    : 'text-memorial-accent dark:text-memorialDark-accent'
                                            }
                                        />
                                    </div>

                                    <div>
                                        <h3
                                            className={`text-lg font-serif mb-1 ${action.primary
                                                ? 'text-white dark:text-memorialDark-bg'
                                                : 'text-memorial-text dark:text-memorialDark-text'
                                                }`}
                                        >
                                            {action.title}
                                        </h3>
                                        <p
                                            className={`text-sm ${action.primary
                                                ? 'text-white/80 dark:text-memorialDark-bg/80'
                                                : 'text-memorial-textSecondary dark:text-memorialDark-textSecondary'
                                                }`}
                                        >
                                            {action.description}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        ) : (
                            <Link
                                href={action.href}
                                className={`block memorial-card p-6 min-h-touch transition-all duration-300 group ${action.primary
                                    ? 'bg-memorial-accent dark:bg-memorialDark-accent text-white dark:text-memorialDark-bg hover:shadow-memorial-lg'
                                    : 'hover:border-memorial-accent dark:hover:border-memorialDark-accent border border-transparent'
                                    }`}
                            >
                                <div className="flex flex-col items-center text-center gap-3">
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${action.primary
                                            ? 'bg-white/20'
                                            : 'bg-memorial-accent/10 dark:bg-memorialDark-accent/10'
                                            }`}
                                    >
                                        <Icon
                                            size={24}
                                            className={
                                                action.primary
                                                    ? 'text-white dark:text-memorialDark-bg'
                                                    : 'text-memorial-accent dark:text-memorialDark-accent'
                                            }
                                        />
                                    </div>

                                    <div>
                                        <h3
                                            className={`text-lg font-serif mb-1 ${action.primary
                                                ? 'text-white dark:text-memorialDark-bg'
                                                : 'text-memorial-text dark:text-memorialDark-text'
                                                }`}
                                        >
                                            {action.title}
                                        </h3>
                                        <p
                                            className={`text-sm ${action.primary
                                                ? 'text-white/80 dark:text-memorialDark-bg/80'
                                                : 'text-memorial-textSecondary dark:text-memorialDark-textSecondary'
                                                }`}
                                        >
                                            {action.description}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
}
