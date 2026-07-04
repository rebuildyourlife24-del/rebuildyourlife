'use client';

import { useState, type FormEvent } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/auth';
import { loginAction } from '@/app/actions/auth';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await loginAction(email, password, rememberMe);
      
      if (result.success) {
        setUser(result.user as any);
        router.push('/dashboard/war-room');
      } else {
        setError(result.error || 'Inloggen mislukt. Controleer je gegevens.');
      }
    } catch (err: any) {
      setError(err.message || 'Er is een fout opgetreden bij het inloggen.');
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Google inloggen mislukt.');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-12 relative selection:bg-gold-500 selection:text-black">
      
      {/* Subtle gold glow behind card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold-500/5 blur-[120px] pointer-events-none rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="bg-zinc-950 border border-zinc-900 p-8 rounded-xl shadow-2xl">
          
          {/* Logo / Header */}
          <div className="mb-8 text-center">
            <span className="text-xl font-black tracking-tighter text-white uppercase block mb-2">
              Rebuild<span className="text-gold-500">YourLife</span>
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight uppercase">
              Inloggen
            </h1>
            <p className="text-zinc-500 text-xs mt-1 font-medium">
              Voer je gegevens in om toegang te krijgen tot het portaal
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 border-l-2 border-red-500 bg-red-950/20 px-4 py-3 rounded-r"
            >
              <p className="text-xs font-bold text-red-400">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">E-mailadres</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="naam@voorbeeld.nl"
                required
                className="w-full bg-black border border-zinc-800 text-white rounded px-4 py-3 outline-none focus:border-gold-500 transition-all text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Wachtwoord</label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-zinc-500 hover:text-gold-500 transition-colors font-semibold"
                >
                  Wachtwoord vergeten?
                </Link>
              </div>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-black border border-zinc-800 text-white rounded px-4 py-3 outline-none focus:border-gold-500 transition-all text-sm"
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <input 
                type="checkbox" 
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 border border-zinc-800 bg-black text-gold-500 focus:ring-0 rounded cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs text-zinc-400 cursor-pointer select-none font-bold">
                Aangemeld blijven
              </label>
            </div>

            <button 
              type="submit" 
              disabled={loading || googleLoading}
              className={`w-full py-3.5 bg-gold-500 text-black hover:bg-gold-400 hover:scale-[1.01] transition-all font-black text-sm uppercase tracking-widest rounded shadow-[0_0_15px_rgba(212,168,83,0.2)] mt-6`}
            >
              {loading ? 'Laden...' : 'Inloggen'}
            </button>
            
          </form>

          {/* Registration link */}
          <div className="mt-8 text-center border-t border-zinc-900 pt-6">
            <p className="text-zinc-500 text-xs font-bold">
              Nog geen account?{' '}
              <Link href="/auth/register" className="text-gold-500 hover:text-gold-400 transition-colors">
                Registreer nu
              </Link>
            </p>
          </div>
          
        </Card>
      </motion.div>
    </div>
  );
}
