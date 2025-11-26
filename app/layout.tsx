import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "./components/SessionProviderWrapper";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Subnav from "./components/Subnav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WebAIGen",
  description: "Crafting elegant digital experiences with precision and heart.",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

        {/* Main top navbar */}
        <Navbar />

        {/* Scroll-aware subnav */}
        <Subnav />

        <SessionProviderWrapper>
          {/* Main content offset below both navbars */}
          <main className="pt-[70px]">
            {children}
          </main>
        </SessionProviderWrapper>

        <Footer />
      </body>
    </html>
  );
}
