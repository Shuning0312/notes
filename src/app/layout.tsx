// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import RootLayoutInternal from "./RootLayoutInternal"; // Client component
import { getNotesStructure } from "@/lib/notes"; // Server-side data fetching

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Boki\'s Blog",
  description: "A personal notes website built with Next.js",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const notesStructure = getNotesStructure(); // Fetch data on the server

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <RootLayoutInternal notesStructure={notesStructure}> {/* Pass data to client component */}
            {children}
          </RootLayoutInternal>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

