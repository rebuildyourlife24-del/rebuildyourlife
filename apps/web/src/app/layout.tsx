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
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { QueryProvider } from "@/components/providers/QueryProvider";
import "./globals.css";

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700"],
  variable: '--font-cormorant'
});

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: '--font-dmsans'
});

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export const viewport: Viewport = {
  themeColor: '#0B0B0D',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "RebuildYourLife | Mission Control",
    template: "%s | RebuildYourLife"
  },
  description: "Het ultieme platform om je leven, financiën en doelen te herbouwen met behulp van AI specialisten.",
  keywords: ["AI Coworker", "Life Coach", "Schulden oplossen", "Budgetteren", "Doelen stellen", "RebuildYourLife"],
  authors: [{ name: "RebuildYourLife Team" }],
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "https://app.rebuildyourlife.eu",
    title: "RebuildYourLife - Mission Control",
    description: "Rebuild Your Future met je eigen virtuele AI team.",
    siteName: "RebuildYourLife",
  },
  twitter: {
    card: "summary_large_image",
    title: "RebuildYourLife - Mission Control",
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
      <body className={`${cormorant.variable} ${dmSans.variable} font-sans min-h-screen bg-[#0B0B0D] text-zinc-300 antialiased selection:bg-[#C8A96B]/30 selection:text-white`}>
        <QueryProvider>
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
        </QueryProvider>
      </body>
    </html>
  );
}
