import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'R&D Admin - Sovereign Grid',
  description: 'Private R&D Environment',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning translate="no">
      <body className="bg-zinc-950 text-white min-h-screen flex flex-col">
        <nav className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <span className="text-xl font-bold text-emerald-500">R&D Admin</span>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link href="/" className="border-emerald-500 text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    Capability Genesis
                  </Link>
                  <Link href="/seo" className="border-transparent text-zinc-400 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                    SEO Control
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
