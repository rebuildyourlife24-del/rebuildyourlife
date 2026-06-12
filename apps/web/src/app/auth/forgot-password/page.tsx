'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { requestPasswordResetAction } from '@/app/actions/passwordReset';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    await requestPasswordResetAction(email);
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0, 1] }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-gold">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0a0e1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5Z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-xl font-bold text-textPrimary">
              Rebuild<span className="gradient-text-gold">YourLife</span>
            </span>
          </Link>
        </div>

        <Card variant="glass" padding="lg">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-textPrimary">Reset Password</h1>
            <p className="mt-1 text-sm text-textSecondary">
              Enter your email address to receive a password reset link.
            </p>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="rounded-xl border border-success/20 bg-success/5 px-4 py-6 text-center"
            >
              <div className="mb-3 flex justify-center text-success">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-textPrimary">Check your email</h3>
              <p className="text-sm text-textSecondary">
                We have sent a password reset link to {email}.
              </p>
              <Link href="/auth/login">
                <Button variant="secondary" className="mt-6 w-full">
                  Return to login
                </Button>
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M22 4L12 13 2 4" />
                  </svg>
                }
              />

              <Button type="submit" fullWidth loading={loading} size="lg">
                Send Reset Link
              </Button>

              <div className="mt-6 text-center">
                <p className="text-sm text-textSecondary">
                  Remember your password?{' '}
                  <Link
                    href="/auth/login"
                    className="font-medium text-gold transition-colors hover:text-gold-light"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
