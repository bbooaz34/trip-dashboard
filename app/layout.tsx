import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import '@/styles/globals.css';

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Black Forest · July 2026',
  description: 'Family trip dashboard — Black Forest, Germany',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Black Forest',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#FAFAF7',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jakartaSans.variable}>
      <head>
        {/* Tabler icons — dual CDN fallback */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/@tabler/icons-webfont@3.34.0/dist/tabler-icons.min.css"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
