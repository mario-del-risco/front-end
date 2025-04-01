// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jiujitsu Database Viewer",
  description: "A MongoDB collection viewer for Jiujitsu database",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen`}>
        <nav className="bg-white dark:bg-gray-800 shadow-md">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-xl font-bold">Jiujitsu Database Explorer</h1>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}