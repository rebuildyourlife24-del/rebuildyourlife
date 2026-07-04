import type { Metadata, Viewport } from "next";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { AuthProvider } from "@/lib/auth";
import { VoiceOrb } from "@/components/ui/VoiceOrb";
import { OrionVisor } from "@/components/ui/OrionVisor";
import { AppHeader } from "@/components/ui/AppHeader";
import { ThemeProvider } from "@/lib/contexts/ThemeContext";
import { LightweightCinematicBackground } from "@/components/3d/LightweightCinematicBackground";
import { SoundscapeEngine } from "@/components/audio/SoundscapeEngine";
import AffiliateTracker from "@/components/AffiliateTracker";
import "./globals.css";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "RebuildYourLife | AI Coworker OS",
    template: "%s | RebuildYourLife"
  },
  description: "Het ultieme platform om je leven, financiën en doelen te herbouwen met behulp van AI specialisten.",
  keywords: ["AI Coworker", "Life Coach", "Schulden oplossen", "Budgetteren", "Doelen stellen", "RebuildYourLife"],
  authors: [{ name: "RebuildYourLife Team" }],
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "https://app.rebuildyourlife.eu",
    title: "RebuildYourLife - AI Coworker OS",
    description: "Rebuild Your Future met je eigen virtuele AI team.",
    siteName: "RebuildYourLife",
  },
  twitter: {
    card: "summary_large_image",
    title: "RebuildYourLife - AI Coworker OS",
    description: "Rebuild Your Future met je eigen virtuele AI team.",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className="dark">
      <body className="min-h-screen bg-transparent text-textPrimary antialiased selection:bg-cyan-500/30 selection:text-white">
        <ThemeProvider>
          <LightweightCinematicBackground />
          <SoundscapeEngine />
          <AffiliateTracker />
          
          <LanguageProvider>
          <AuthProvider>
            <AppHeader />
            {children}
            <OrionVisor />
            <VoiceOrb />
          </AuthProvider>
        </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
