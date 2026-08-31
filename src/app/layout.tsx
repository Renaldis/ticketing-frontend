import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'TICKETIX | Cyber-Enterprise Live Event Pass Platform',
  description: 'Cryptographically verified, atomic concurrency ticket reservation and gate scanner engine.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&display=swap"
          rel="stylesheet"
        />
        {/* Midtrans Snap JS Sandbox Script */}
        <script
          type="text/javascript"
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'SB-Mid-client-sample'}
        ></script>
      </head>
      <body
        suppressHydrationWarning
        className="bg-[#0d0d15] text-[#e4e1ed] min-h-screen antialiased flex flex-col selection:bg-indigo-500/30 selection:text-cyan-300"
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
