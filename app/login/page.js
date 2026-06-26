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

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
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
            disabled={loading}
            className="w-full py-3 mt-4 bg-text-primary text-white rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:transform-none"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-center text-sm text-text-muted mt-6">
          Don't have an account?{' '}
          <Link href="/register" className="text-accent-green font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
