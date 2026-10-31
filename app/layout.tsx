import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import SiteShell from "@/components/site-shell";
import MotionEngine from "@/components/motion-engine";
import "./globals.css";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;

export const metadata: Metadata = {
  ...(configuredSiteUrl ? { metadataBase: new URL(configuredSiteUrl) } : {}),
  title: {
    default: "NatexWorks — Digital work, built around real business",
    template: "%s — NatexWorks",
  },
  description:
    "NatexWorks builds business websites, custom web applications, responsive interfaces, and practical local-search foundations.",
  applicationName: "NatexWorks",
  robots: { index: true, follow: true },
  alternates: {
    canonical: configuredSiteUrl ? new URL("/", configuredSiteUrl).toString() : undefined,
  },
  openGraph: {
    type: "website",
    siteName: "NatexWorks",
    title: "NatexWorks — Digital work, built around real business",
    description:
      "Business websites, custom web applications, responsive interfaces, and practical local-search foundations.",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "NatexWorks — Digital work, built around real business" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NatexWorks — Digital work, built around real business",
    description: "Thoughtful websites and practical digital tools for business.",
    images: ["/og-image.svg"],
  },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#f2f0e9",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SiteShell>{children}</SiteShell>
        <MotionEngine />
      </body>
    </html>
  );
}
