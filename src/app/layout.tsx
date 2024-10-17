'use client';
// app/layout.tsx (or layout.js)
import { SessionProvider } from 'next-auth/react';
import './globals.css'; // if you have global styles
import { ToastContainer } from 'react-toastify';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
