import type { Metadata, Viewport } from "next";
import { Source_Sans_3 as FontSans } from "next/font/google";
import Image from "next/image";
import "./globals.css";
import "./brain-decorations.css";
import Header from "@/components/ui/common/header";
import Footer from "@/components/ui/common/footer";
import { ClerkProvider } from "@clerk/nextjs";
import { NotificationProvider } from "@/components/ui/common/notification-provider";
import { AnalyticsProvider } from "@/lib/analytics";
import { Suspense } from "react";
import { getDefaultMetadata, getMetadataBase, getOpenGraph } from "@/lib/utils";
import { ThemeProvider } from "next-themes";

const fontSans = FontSans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap", // Ensure text remains visible during font loading
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#E11D48"
};

export const metadata: Metadata = getDefaultMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <ClerkProvider>
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#E11D48" />
      </head>
      <body className={`${fontSans.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <NotificationProvider>
            <div className="relative flex min-h-screen flex-col">
              {/* Brain decorations - using Next.js Image for better performance */}
              <div aria-hidden="true">
                <Image src="/blue.png" alt="" width={100} height={100} className="brain-decoration blue-brain-1" priority />
                <Image src="/blue.png" alt="" width={100} height={100} className="brain-decoration blue-brain-2" />
                <Image src="/blue.png" alt="" width={100} height={100} className="brain-decoration blue-brain-3" />
                <Image src="/blue.png" alt="" width={100} height={100} className="brain-decoration blue-brain-4" />
                <Image src="/blue.png" alt="" width={100} height={100} className="brain-decoration blue-brain-5" />
                <Image src="/colorful.png" alt="" width={100} height={100} className="brain-decoration colorful-brain-1" priority />
                <Image src="/colorful.png" alt="" width={100} height={100} className="brain-decoration colorful-brain-2" />
                <Image src="/colorful.png" alt="" width={100} height={100} className="brain-decoration colorful-brain-3" />
                <Image src="/colorful.png" alt="" width={100} height={100} className="brain-decoration colorful-brain-4" />
                <Image src="/colorful.png" alt="" width={100} height={100} className="brain-decoration colorful-brain-5" />
              </div>
              
              {/* Skip to content link for accessibility */}
              <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-rose-600 focus:text-white focus:z-50 focus:top-2 focus:left-2 rounded">
                Skip to main content
              </a>
              
              <Header/>
              <main id="main-content" className="flex-1">{children}</main>
              <Footer/>
            </div>
          </NotificationProvider>
          <Suspense fallback={null}>
            <AnalyticsProvider />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
   </ClerkProvider>
  );
}
