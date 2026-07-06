'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { registerAction } from '@/app/actions/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await registerAction(formData);
      
      if (result.success) {
        setSuccess(result.message || 'Registratie succesvol! Controleer je e-mail.');
        // router.push('/auth/login?registered=true'); // Optioneel
      } else {
        setError(result.error || 'Registratie mislukt');
      }
    } catch (err: any) {
      setError(err.message || 'Er is een fout opgetreden.');
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

        <Card className="p-6 bg-black/40 border-[#00f0ff]/20">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-textPrimary">Nieuwe Registratie</h1>
            <p className="mt-1 text-sm text-textSecondary">
              Meld je aan voor toegang tot the Swarm.
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

          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 rounded-xl border border-success/20 bg-success/5 px-4 py-3"
            >
              <p className="text-sm text-success">{success}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="firstName"
                label="Voornaam"
                type="text"
                required
              />
              <Input
                name="lastName"
                label="Achternaam"
                type="text"
                required
              />
            </div>

            <Input
              name="email"
              label="E-mailadres"
              type="email"
              required
            />

            <Input
              name="password"
              label="Wachtwoord"
              type="password"
              placeholder="Minimaal 12 tekens"
              required
            />

            <Button 
              type="submit" 
              className="w-full bg-[#d4a853] hover:bg-[#b38d45] text-black font-bold tracking-widest uppercase mt-6 transition-all shadow-[0_0_15px_rgba(212,168,83,0.3)]"
              disabled={loading}
            >
              {loading ? 'Bezig...' : '[ MAAK ACCOUNT AAN ]'}
            </Button>
            
            <div className="mt-6 text-center">
              <Link
                href="/auth/login"
                className="text-sm text-textSecondary hover:text-gold transition-colors"
              >
                Heb je al een account? Log in.
              </Link>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
