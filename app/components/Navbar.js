'use client';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const authLinks = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'AI Assistant', href: '/chat' },
    { label: 'Hospitals', href: '/hospitals' },
    { label: 'Reminders', href: '/reminders' },
    { label: 'Schemes', href: '/schemes' },
  ];

  const publicLinks = [
    { label: 'Features', href: '/#features' },
    { label: 'How it Works', href: '/#how-it-works' },
    { label: 'Impact', href: '/#impact' },
    { label: 'Schemes', href: '/schemes' },
  ];

  const links = session ? authLinks : publicLinks;

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 flex justify-center pt-6 px-4 ${scrolled ? 'pt-4' : ''}`}>
      <div className={`glass w-full max-w-5xl px-6 py-3 flex items-center justify-between rounded-full transition-shadow ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
        <Link href="/" className="flex items-center gap-2 font-display font-bold text-lg text-foreground hover:opacity-80 transition-opacity">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent-green/10 text-accent-green">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M12 12l-9-5M12 12v10M12 12l9-5" stroke="currentColor" strokeWidth="1.8"/>
            </svg>
          </span>
          Arogya AI
        </Link>
        
        <ul className="hidden md:flex items-center gap-8">
          {links.map(l => {
            const isActive = pathname === l.href;
            return (
              <li key={l.label}>
                <Link 
                  href={l.href} 
                  className={`text-sm font-medium transition-colors hover:text-accent-green ${isActive ? 'text-accent-green' : 'text-text-secondary'}`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-4">
          {status === 'loading' ? (
            <div className="w-20 h-10 bg-black/5 rounded-full animate-pulse" />
          ) : session ? (
            <div className="flex items-center gap-3">
              <Link href="/emergency" className="hidden sm:flex text-sm font-medium text-red-500 hover:text-red-600 mr-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 transition-colors">
                SOS
              </Link>
              <Link href="/profile" className="w-9 h-9 rounded-full bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center text-accent-blue font-bold shadow-sm hover:shadow-md transition-all">
                {session.user?.name?.[0] || 'U'}
              </Link>
              <button 
                onClick={() => signOut()}
                className="text-sm font-medium text-text-secondary hover:text-foreground transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-text-secondary hover:text-foreground transition-colors">
                Log In
              </Link>
              <Link href="/register" className="text-sm font-medium px-5 py-2.5 bg-foreground text-white rounded-full shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
