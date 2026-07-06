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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://globalshipping-logistics.com";
const DESCRIPTION =
  "GSL moves freight by road — FTL, LTL, cross-border corridors and last-mile — with live tracking, lower emissions, and door-to-door reliability.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Global Shipping & Logistics | Road Freight, Engineered",
  description: DESCRIPTION,
  keywords: [
    "road freight", "FTL", "LTL", "cross-border trucking", "last-mile delivery",
    "logistics Hamburg", "Europe North Africa corridors", "low emission freight",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Global Shipping & Logistics",
    title: "Global Shipping & Logistics | Road Freight, Engineered",
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Global Shipping & Logistics | Road Freight, Engineered",
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
