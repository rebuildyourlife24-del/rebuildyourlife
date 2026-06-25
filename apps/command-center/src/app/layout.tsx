import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vault | Henk Semler Command Center",
  description: "Secure Autonomous Command Center",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#05050f] text-white overflow-hidden">
        {children}
        
        {/* Hermes Connection Alerting Protocol Heartbeat */}
        <script dangerouslySetInnerHTML={{
          __html: `
            setInterval(() => {
              fetch('/api/heartbeat', { method: 'POST' }).catch(console.error);
            }, 5 * 60 * 1000); // Elke 5 minuten
            
            // Ook een heartbeat bij het opstarten
            setTimeout(() => {
              fetch('/api/heartbeat', { method: 'POST' }).catch(console.error);
            }, 5000);
          `
        }} />
      </body>
    </html>
  );
}
