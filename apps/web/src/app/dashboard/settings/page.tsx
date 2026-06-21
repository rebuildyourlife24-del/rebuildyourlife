'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { api, formatApiError } from '@/lib/api';
import Link from 'next/link';


export default function SettingsPage() {

  const [loading, setLoading] = useState(true);
  
  // Profile Form
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get<{ data: any }>('/user/me');
        if (res.data) {
          const d: any = res.data;
          setFirstName(d.firstName || '');
          setLastName(d.lastName || '');
          setOpenaiKey(d.openaiKey || '');
        }
      } catch (err: any) {
        console.log("Settings API niet bereikbaar:", err?.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage('');
    setProfileError('');
    setProfileSaving(true);

    try {
      await api.patch('/user/me', { firstName, lastName, openaiKey });
      setProfileMessage('Profiel succesvol opgeslagen!');
    } catch (err) {
      setProfileError(formatApiError(err));
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage('');
    setPasswordError('');
    setPasswordSaving(true);

    try {
      await api.patch('/user/password', { currentPassword, newPassword });
      setPasswordMessage('Wachtwoord succesvol gewijzigd!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setPasswordError(formatApiError(err));
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading) {
    return <div className="text-white text-center py-12">Laden...</div>;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Instellingen</h1>
          <p className="mt-1 text-sm text-textSecondary">
            Beheer je profiel, beveiliging en AI-voorkeuren.
          </p>
        </div>
        <Link 
          href="/dashboard/settings/integrations" 
          className="rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors border border-white/10"
        >
          Integraties Beheren &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* E-mail Vault */}
        <Link href="/dashboard/settings/emails">
          <div className="border border-red-900 bg-black p-6 hover:bg-red-950/20 transition-all cursor-pointer shadow-[inset_0_0_15px_rgba(153,27,27,0.1)] hover:shadow-[inset_0_0_20px_rgba(220,38,38,0.3)] h-full">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-950/50 border border-red-900 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
              </div>
              <h3 className="text-white font-bold tracking-widest text-lg">E-MAIL VAULT</h3>
            </div>
            <p className="text-red-500/70 text-sm">
              Koppel inboxen voor AI schuld-scan.
            </p>
          </div>
        </Link>

        {/* API Integrations */}
        <Link href="/dashboard/settings/integrations">
          <div className="border border-red-900 bg-black p-6 hover:bg-red-950/20 transition-all cursor-pointer shadow-[inset_0_0_15px_rgba(153,27,27,0.1)] hover:shadow-[inset_0_0_20px_rgba(220,38,38,0.3)] h-full">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-950/50 border border-red-900 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h3 className="text-white font-bold tracking-widest text-lg">SYSTEM INTEGRATIONS</h3>
            </div>
            <p className="text-red-500/70 text-sm">
              Beheer Shopify & Stripe API verbindingen.
            </p>
          </div>
        </Link>
      </div>

      <Card variant="glass" className="p-6">
        <h2 className="text-lg font-medium text-textPrimary mb-4">Mijn Profiel</h2>
        
        {profileMessage && <div className="mb-4 p-3 rounded-lg bg-success/10 text-success border border-success/20 text-sm">{profileMessage}</div>}
        {profileError && <div className="mb-4 p-3 rounded-lg bg-danger/10 text-danger border border-danger/20 text-sm">{profileError}</div>}

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Voornaam"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <Input
              label="Achternaam"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          
          <div className="pt-4 border-t border-white/5">
            <h3 className="text-md font-medium text-textPrimary mb-2 flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gold" strokeWidth="2">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
              </svg>
              OpenAI API Integratie
            </h3>
            <p className="text-xs text-textSecondary mb-4">
              Koppel je eigen sleutel om de AI Coworkers tot leven te wekken.
            </p>
            <Input
              label="OpenAI API Key"
              type="password"
              placeholder="sk-proj-..."
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={profileSaving}>
              {profileSaving ? 'Opslaan...' : 'Wijzigingen Opslaan'}
            </Button>
          </div>
        </form>
      </Card>

      <Card variant="glass" className="p-6">
        <h2 className="text-lg font-medium text-textPrimary mb-4">Beveiliging</h2>
        
        {passwordMessage && <div className="mb-4 p-3 rounded-lg bg-success/10 text-success border border-success/20 text-sm">{passwordMessage}</div>}
        {passwordError && <div className="mb-4 p-3 rounded-lg bg-danger/10 text-danger border border-danger/20 text-sm">{passwordError}</div>}

        <form onSubmit={handlePasswordSave} className="space-y-4">
          <Input
            label="Huidig Wachtwoord"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <Input
            label="Nieuw Wachtwoord"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
          />
          <div className="flex justify-end pt-2">
            <Button type="submit" variant="secondary" disabled={passwordSaving}>
              {passwordSaving ? 'Bezig...' : 'Wachtwoord Wijzigen'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
