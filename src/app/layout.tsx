"use client";

import './globals.css'

import { Inter } from 'next/font/google'
import { useState, createContext } from 'react';
import { TMovie, TAppContext, TContext } from "./types";

const inter = Inter({ subsets: ['latin'] })

export const AppContext = createContext<TAppContext>({});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [ctx, setCtx] = useState<TContext>()
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppContext.Provider value={{ ctx, setCtx }}>
          <main className="flex min-h-screen items-center content-center justify-center">
            {children}
          </main>
        </AppContext.Provider>
      </body>
    </html>
  )
}
