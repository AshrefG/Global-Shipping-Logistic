import type { Metadata } from "next";
import { Archivo, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Display voice (DESIGN.md): highway-signage DNA — wide, heavy, engineered.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.gsldubai.com";
const DESCRIPTION =
  "GSL Dubai, part of Al Shirawi Group — 3PL freight forwarding, customs clearance, transport, cold chain warehousing (ambient to −25°C) and distribution across the UAE and GCC. ISO 9001, 14001, 22000, 45001 and BRCGS certified.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Global Shipping & Logistics Dubai | 3PL · Cold Chain · Driven by You",
  description: DESCRIPTION,
  keywords: [
    "3PL Dubai", "cold chain warehousing Dubai", "freight forwarding Dubai",
    "customs clearance UAE", "port haulage Jebel Ali", "distribution UAE",
    "Al Shirawi Group", "BRCGS certified logistics",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Global Shipping & Logistics",
    title: "Global Shipping & Logistics Dubai | 3PL · Cold Chain · Driven by You",
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Global Shipping & Logistics Dubai | 3PL · Cold Chain · Driven by You",
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${archivo.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
