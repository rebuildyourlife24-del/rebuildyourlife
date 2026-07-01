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
        window.location.href = '/dashboard';
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(212,168,83,0.05)_0%,transparent_70%)] pointer-events-none" />

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
              className="mb-6 border-l-2 border-gold bg-[#0a192f]/20 px-4 py-3 rounded-r"
            >
              <p className="text-xs font-bold text-goldLight">{error}</p>
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
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-zinc-800"></div>
              <span className="flex-shrink-0 mx-4 text-zinc-500 text-xs font-bold uppercase">Of</span>
              <div className="flex-grow border-t border-zinc-800"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading || googleLoading}
              className="w-full py-3.5 bg-white text-black hover:bg-zinc-200 transition-all font-bold text-sm rounded flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {googleLoading ? 'Laden...' : 'Inloggen met Google'}
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

