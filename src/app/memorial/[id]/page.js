'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import MemorialNav from '@/components/memorial/MemorialNav';
import MemorialHero from '@/components/memorial/MemorialHero';
import Timeline from '@/components/memorial/Timeline';
import PhotoGallery from '@/components/memorial/PhotoGallery';
import Guestbook from '@/components/memorial/Guestbook';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import toast from 'react-hot-toast';

export default function MemorialProfilePage() {
  const params = useParams();
  const memorialId = params?.id;
  const supabase = createClientComponentClient();

  const [memorial, setMemorial] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');

  // Fetch memorial data
  useEffect(() => {
    if (!memorialId) return;

    const fetchMemorial = async () => {
      try {
        const { data, error } = await supabase
          .from('memorials')
          .select('*')
          .eq('id', memorialId)
          .single();

        if (error) throw error;
        setMemorial(data);
      } catch (error) {
        console.error('Error fetching memorial:', error);
        toast.error('Failed to load memorial');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemorial();
  }, [memorialId, supabase]);

  // Fetch guestbook messages
  useEffect(() => {
    if (!memorialId) return;

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('guestbook_messages')
          .select('*')
          .eq('memorial_id', memorialId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setMessages(data || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [memorialId, supabase]);

  // Handle guestbook submission
  const handleGuestbookSubmit = async (formData) => {
    try {
      const { error } = await supabase
        .from('guestbook_messages')
        .insert([
          {
            memorial_id: memorialId,
            name: formData.name,
            email: formData.email || null,
            message: formData.message,
            created_at: new Date().toISOString(),
          },
        ]);

      if (error) throw error;

      // Refresh messages
      const { data: newMessages } = await supabase
        .from('guestbook_messages')
        .select('*')
        .eq('memorial_id', memorialId)
        .order('created_at', { ascending: false });

      setMessages(newMessages || []);
      toast.success('Thank you for sharing your memory', {
        icon: '💙',
        style: {
          background: '#FAF9F7',
          color: '#2C2C2C',
          padding: '16px',
          borderRadius: '8px',
        },
      });
    } catch (error) {
      console.error('Error submitting message:', error);
      toast.error('Failed to submit message. Please try again.');
      throw error;
    }
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'life-story', 'photos', 'guestbook'];
      const scrollPosition = window.scrollY + 100;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-memorial-bg dark:bg-memorialDark-bg">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-memorial-gold/30 border-t-memorial-gold dark:border-memorialDark-gold/30 dark:border-t-memorialDark-gold rounded-full animate-spin mx-auto mb-4" />
          <p className="text-memorial-textSecondary dark:text-memorialDark-textSecondary">
            Loading memorial...
          </p>
        </div>
      </div>
    );
  }

  if (!memorial) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-memorial-bg dark:bg-memorialDark-bg px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl md:text-3xl font-serif text-memorial-text dark:text-memorialDark-text mb-4">
            Memorial Not Found
          </h1>
          <p className="text-memorial-textSecondary dark:text-memorialDark-textSecondary mb-8">
            We couldn't find the memorial you're looking for. It may have been removed or the link may be incorrect.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-memorial-gold dark:bg-memorialDark-gold text-white rounded-memorial hover:opacity-90 transition-opacity duration-200"
          >
            Return Home
          </a>
        </div>
      </div>
    );
  }

  // Sample data structure (replace with actual memorial data)
  const sampleData = {
    name: memorial.name || 'Beloved Name',
    dateOfBirth: memorial.date_of_birth || '1950-01-01',
    dateOfPassing: memorial.date_of_passing || '2024-01-01',
    mainPhoto: memorial.main_photo_url || '/images/memorial-placeholder.jpg',
    quote: memorial.quote || 'Forever in our hearts',
    biography: memorial.biography || 'A life well lived, a legacy of love.',

    milestones: memorial.milestones || [
      {
        id: 1,
        date: '1950-01-01',
        title: 'Born',
        description: 'Born in a small town...',
      },
      {
        id: 2,
        date: '1972-06-15',
        title: 'Married',
        description: 'Married the love of their life...',
      },
    ],

    photos: memorial.photos || [
      {
        id: 1,
        url: '/images/photo1.jpg',
        caption: 'A cherished moment',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-memorial-bg dark:bg-memorialDark-bg pb-20 md:pb-8">
      {/* Navigation */}
      <MemorialNav memorialId={memorialId} activeSection={activeSection} />

      {/* Hero Section */}
      <section id="home" className="scroll-mt-20">
        <MemorialHero memorial={sampleData} />
      </section>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Life Story / Timeline Section */}
        {sampleData.milestones && sampleData.milestones.length > 0 && (
          <section id="life-story" className="py-12 md:py-16 scroll-mt-20">
            <h2 className="text-3xl md:text-4xl font-serif text-memorial-text dark:text-memorialDark-text mb-8 md:mb-12 text-center">
              Life Story
            </h2>
            <div className="max-w-4xl mx-auto">
              <Timeline milestones={sampleData.milestones} />
            </div>
          </section>
        )}

        {/* Divider */}
        <div className="border-t border-memorial-divider dark:border-memorialDark-divider my-12 md:my-16" />

        {/* Photo Gallery Section */}
        {sampleData.photos && sampleData.photos.length > 0 && (
          <section id="photos" className="py-12 md:py-16 scroll-mt-20">
            <h2 className="text-3xl md:text-4xl font-serif text-memorial-text dark:text-memorialDark-text mb-8 md:mb-12 text-center">
              Treasured Memories
            </h2>
            <PhotoGallery photos={sampleData.photos} />
          </section>
        )}

        {/* Divider */}
        <div className="border-t border-memorial-divider dark:border-memorialDark-divider my-12 md:my-16" />

        {/* Guestbook Section */}
        <section id="guestbook" className="py-12 md:py-16 scroll-mt-20">
          <h2 className="text-3xl md:text-4xl font-serif text-memorial-text dark:text-memorialDark-text mb-8 md:mb-12 text-center">
            Book of Memories
          </h2>
          <div className="max-w-4xl mx-auto">
            <Guestbook
              messages={messages}
              onSubmit={handleGuestbookSubmit}
              isLoading={false}
            />
          </div>
        </section>
      </div>

      {/* Footer Note */}
      <footer className="mt-16 py-8 text-center text-sm text-memorial-textSecondary dark:text-memorialDark-textSecondary border-t border-memorial-divider dark:border-memorialDark-divider no-print">
        <p className="max-w-2xl mx-auto px-4">
          This memorial page is a place to celebrate, remember, and honor a life well lived.
          <br />
          Created with love by HereAfter, Pal
        </p>
      </footer>
    </div>
  );
}
