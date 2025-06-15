import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AuthProvider } from "@/lib/auth"
import { DebugAuth } from "@/components/debug-auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DocsNepal - Generate Official and Personal Documents in Nepali",
  description:
    "Generate official and personal documents in Nepali — easily, quickly, and correctly. Nibedan, CV, Patta, Affidavits and more.",
  keywords: "Nepal documents, Nepali forms, CV generator, Nibedan, Affidavit, Legal documents",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Navigation />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
            <DebugAuth />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
