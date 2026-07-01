import type { Metadata, Viewport } from "next";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { AuthProvider } from "@/lib/auth";
import { VoiceOrb } from "@/components/ui/VoiceOrb";
import { OrionVisor } from "@/components/ui/OrionVisor";
import { AppHeader } from "@/components/ui/AppHeader";
import "./globals.css";
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export const viewport: Viewport = {
  themeColor: '#02040a',
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
      <body className="min-h-screen bg-navy text-textPrimary antialiased selection:bg-gold/30 selection:text-goldLight">
        {/* Deep Space Ice Glass Background Elements */}
        <div className="fixed inset-0 -z-50 overflow-hidden bg-navy pointer-events-none">
          {/* Subtle slow drift Starfield */}
          <div className="absolute inset-0 space-stars opacity-[0.6]" style={{ animation: 'stars 200s linear infinite' }} />
          <div className="absolute inset-0 space-stars opacity-[0.3]" style={{ transform: 'scale(1.5)', animation: 'stars 350s linear infinite reverse' }} />
          
          {/* No background blobs - maintaining pure intense black background */}
        </div>
        
        <LanguageProvider>
          <AuthProvider>
            <AppHeader />
            {children}
            <OrionVisor />
            <VoiceOrb />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
