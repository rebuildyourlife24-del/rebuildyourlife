import type { Metadata } from "next";
import "./globals.css";
import { HermesOverlay } from "../components/HermesOverlay";

export const metadata: Metadata = {
  title: "Godbrain | Enterprise OS",
  description: "Supreme Overseer Command Center",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        {children}
        <HermesOverlay />
      </body>
    </html>
  );
}
