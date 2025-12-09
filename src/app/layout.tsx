import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Epoch ChessLabs",
  description: "Learn and practice chess openings",
  icons: {
    icon: '/favicon.png',
  },
};

import { ClerkProvider } from "@clerk/nextjs";
import { SettingsProvider } from "@/context/SettingsContext";
import { ThemeProvider } from "@/components/theme-provider";

import { Toaster } from "sonner";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full" suppressHydrationWarning>
        <body className={`${inter.className} h-full`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <SettingsProvider>
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
              <Toaster />
            </SettingsProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
