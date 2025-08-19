import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AmplifyProvider from "./amplify-config";
import AuthProvider from "./providers/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Golden Dragon - Authentic Chinese Restaurant",
  description: "Experience authentic Chinese cuisine at Golden Dragon Restaurant. Order delivery, make reservations, and explore our traditional menu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AmplifyProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </AmplifyProvider>
      </body>
    </html>
  );
}
