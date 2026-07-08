'use client';

import { AuthProvider } from '@/lib/auth';
import { JarvisProvider } from '@/components/JarvisProvider';
import { JarvisOmniWidget } from '@/components/JarvisOmniWidget';

import { AppHeader } from "@/components/ui/AppHeader";
import { OrionVisor } from "@/components/ui/OrionVisor";
import { VoiceOrb } from "@/components/ui/VoiceOrb";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <JarvisProvider>
        {/* GLOBAL NAVY BACKGROUND WITH WORLD MAP */}
        <div className="fixed inset-0 z-[-2] bg-[#02040a]"></div>
        <div 
          className="fixed inset-0 z-[-1] opacity-20 bg-center bg-no-repeat bg-cover pointer-events-none"
          style={{ backgroundImage: "url('/world-map-hud.png')", mixBlendMode: 'screen', filter: 'hue-rotate(200deg) saturate(1.5)' }}
        ></div>
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/15 blur-[120px] rounded-full pointer-events-none z-[-1]"></div>

        <div className="relative z-10 flex flex-col min-h-screen w-full text-zinc-300 overflow-hidden">
          <AppHeader />
          <main className="flex-1 flex flex-col">{children}</main>
          <OrionVisor />
          <VoiceOrb />
        </div>
        
        <JarvisOmniWidget />
      </JarvisProvider>
    </AuthProvider>
  );
}
