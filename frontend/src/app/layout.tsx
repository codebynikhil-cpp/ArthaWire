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
  title: "ArthaWire — Institutional Financial Intelligence & X-Creator Terminal",
  description: "Real-time Dalal Street (NSE/BSE) creator intelligence, FinBERT NLP sentiment analysis, multi-creator consensus & event detection.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-fin-bg text-fin-text selection:bg-blue-600/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
