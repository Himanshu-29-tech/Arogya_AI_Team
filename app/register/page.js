'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/login?registered=true');
      } else {
        const data = await res.json();
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-bg-primary to-bg-secondary relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-accent-blue/20 rounded-full blur-[80px]" />
      <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 bg-accent-green/15 rounded-full blur-[80px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-md p-8 relative z-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <span className="w-8 h-8 rounded-lg bg-accent-blue/10 flex items-center justify-center text-accent-blue font-bold">A</span>
            <span className="font-display font-bold text-xl">Arogya AI</span>
          </Link>
          <h1 className="text-2xl font-bold font-display text-text-primary">Create Account</h1>
          <p className="text-text-muted text-sm mt-2">Join the future of healthcare intelligence</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/50 border border-border-card focus:border-accent-blue focus:ring-1 focus:ring-accent-blue outline-none transition-all"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/50 border border-border-card focus:border-accent-blue focus:ring-1 focus:ring-accent-blue outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/50 border border-border-card focus:border-accent-blue focus:ring-1 focus:ring-accent-blue outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            id="signup-btn"
            disabled={loading}
            className="w-full py-3.5 mt-4 bg-[#2a7d5f] text-white rounded-xl font-semibold hover:bg-[#20634b] hover:shadow-lg active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 text-base"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-text-muted mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-accent-blue font-medium hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
