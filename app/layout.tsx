import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { DuotoneDefs } from "@/components/visual/Photo";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument", display: "swap" });

export const metadata: Metadata = {
  title: { default: "FinApt Group — Audit, Tax & Advisory in Dubai", template: "%s · FinApt Group" },
  description: "Partner-led audit, tax, accounting, advisory and corporate services in the UAE.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#0c0f14", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${instrument.variable}`}>
      <body className="min-h-dvh">
        <DuotoneDefs />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
