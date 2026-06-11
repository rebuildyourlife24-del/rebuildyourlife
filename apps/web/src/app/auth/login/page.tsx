'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

import { loginAction } from '@/app/actions/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await loginAction(email, password);
      
      if (result.success) {
        // We set the secure cookie via Server Actions, so we just redirect
        router.push('/dashboard');
      } else {
        setError(result.error || 'Inloggen mislukt');
      }
    } catch (err) {
      setError('Er ging iets mis met het verbinden met de beveiligde kluis.');
    } finally {
      setLoading(false);
    }
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
            <h1 className="text-2xl font-bold text-textPrimary">Commandocentrum</h1>
            <p className="mt-1 text-sm text-textSecondary">
              Activeer je sessie om je missie voort te zetten.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 rounded-xl border border-danger/20 bg-danger/5 px-4 py-3"
            >
              <p className="text-sm text-danger">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Identificatie (E-mail)"
              type="email"
              placeholder="operator@rebuildyourlife.eu"
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

            <Input
              label="Toegangscode"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              }
            />

            <div className="flex items-center justify-end">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-gold transition-colors hover:text-goldLight"
              >
                Code vergeten?
              </Link>
            </div>

            <Button type="submit" fullWidth loading={loading} size="lg">
              Activeer Sessie
            </Button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <p className="text-sm text-textSecondary mb-2">
              Klaar om de controle over je leven te herpakken?
            </p>
            <Link
              href="/auth/register"
              className="inline-block rounded-lg px-4 py-2 font-bold text-navy bg-gold transition-all hover:scale-105 hover:bg-goldLight hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]"
            >
              Start Je Ontwikkeling Nu
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
