'use client';

import { AuthProvider } from '@/lib/auth';
import { JarvisProvider } from '@/components/JarvisProvider';
import { JarvisOmniWidget } from '@/components/JarvisOmniWidget';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <JarvisProvider>
        <div className="w-full min-h-screen bg-[#020202] text-zinc-300 overflow-hidden">
          {children}
        </div>
        <JarvisOmniWidget />
      </JarvisProvider>
    </AuthProvider>
  );
}
