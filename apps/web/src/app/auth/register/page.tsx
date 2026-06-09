'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { api, formatApiError } from '@/lib/api';
import type { AuthResponse } from '@rebuildyourlife/shared';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (form.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }
    if (form.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setLoading(true);

    try {
      const response = await api.post<AuthResponse>('/auth/register', {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      const { tokens } = response.data;
      localStorage.setItem('ryl_access_token', tokens.accessToken);
      localStorage.setItem('ryl_refresh_token', tokens.refreshToken);
      router.push('/dashboard');
    } catch (err) {
      setServerError(formatApiError(err));
    } finally {
      setLoading(false);
    }
  }

  function updateField(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    };
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0, 1] }}
        className="w-full max-w-md"
      >
        {/* Logo */}
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
            <h1 className="text-2xl font-bold text-textPrimary">Create your account</h1>
            <p className="mt-1 text-sm text-textSecondary">
              Start your journey to a rebuilt future
            </p>
          </div>

          {serverError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 rounded-xl border border-danger/20 bg-danger/5 px-4 py-3"
            >
              <p className="text-sm text-danger">{serverError}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="First Name"
                type="text"
                placeholder="John"
                value={form.firstName}
                onChange={updateField('firstName')}
                error={errors.firstName}
                required
                autoComplete="given-name"
              />
              <Input
                label="Last Name"
                type="text"
                placeholder="Doe"
                value={form.lastName}
                onChange={updateField('lastName')}
                error={errors.lastName}
                required
                autoComplete="family-name"
              />
            </div>

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={updateField('email')}
              error={errors.email}
              required
              autoComplete="email"
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 4L12 13 2 4" />
                </svg>
              }
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={updateField('password')}
              error={errors.password}
              hint="Must be at least 8 characters"
              required
              autoComplete="new-password"
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              }
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={updateField('confirmPassword')}
              error={errors.confirmPassword}
              required
              autoComplete="new-password"
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              }
            />

            <Button type="submit" fullWidth loading={loading} size="lg">
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-textSecondary">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="font-medium text-gold transition-colors hover:text-gold-light"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>

        <p className="mt-6 text-center text-xs text-textSecondary/60">
          By creating an account, you agree to our{' '}
          <Link href="#" className="text-textSecondary hover:text-textPrimary transition-colors">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="#" className="text-textSecondary hover:text-textPrimary transition-colors">
            Privacy Policy
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
