import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppShell } from '@/components/app-shell';

export const metadata: Metadata = {
  title: { default: 'عقار DZ', template: '%s | عقار DZ' },
  description: 'منصة عقارية جزائرية للبيع والشراء والكراء',
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#ffffff' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body><AppShell>{children}</AppShell></body>
    </html>
  );
}
