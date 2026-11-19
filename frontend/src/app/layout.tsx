import './globals.css';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';

const inter = Inter({ weight: ['--weight-thin', '--weight-extralight', '--weight-light', '--weight-normal', '--weight-medium', '--weight-semibold', '--weight-bold', '--weight-extrabold', '--weight-black'], subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Cartoon Studio AI',
  description: 'AI-powered Cartoon Studio for creating animated episodes',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} style={{ 
        background: 'var(--background)',
        color: 'var(--foreground)',
        minHeight: '100vh',
      }}>
        {children}
      </body>
    </html>
  );
}