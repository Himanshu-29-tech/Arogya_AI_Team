'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: email.trim(),
        password,
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else if (res?.ok) {
        router.push('/dashboard');
        router.refresh();
      } else {
        setError('Login failed. Please verify your credentials.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Sign in exception:', err);
      setError('An error occurred during sign in. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-bg-primary to-bg-secondary relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-accent-green/20 rounded-full blur-[80px]" />
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-accent-blue/15 rounded-full blur-[80px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-md p-8 relative z-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <span className="w-8 h-8 rounded-lg bg-accent-green/10 flex items-center justify-center text-accent-green font-bold">A</span>
            <span className="font-display font-bold text-xl">Arogya AI</span>
          </Link>
          <h1 className="text-2xl font-bold font-display text-text-primary">Welcome Back</h1>
          <p className="text-text-muted text-sm mt-2">Log in to your intelligent health companion</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/50 border border-border-card focus:border-accent-green focus:ring-1 focus:ring-accent-green outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/50 border border-border-card focus:border-accent-green focus:ring-1 focus:ring-accent-green outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            id="signin-btn"
            disabled={loading}
            className="w-full py-3.5 mt-4 bg-[#111110] text-white rounded-xl font-semibold hover:bg-black hover:shadow-lg active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 text-base"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-border-card text-center">
          <button
            type="button"
            onClick={() => {
              setEmail('demo@arogya.ai');
              setPassword('demo123');
            }}
            className="text-xs text-accent-green hover:underline font-medium bg-accent-green/10 px-3 py-1.5 rounded-lg transition-colors"
          >
            ⚡ Quick Fill Demo Login (demo@arogya.ai / demo123)
          </button>
        </div>

        <p className="text-center text-sm text-text-muted mt-4">
          Don't have an account?{' '}
          <Link href="/register" className="text-accent-green font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
