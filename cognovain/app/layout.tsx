import type { Metadata, Viewport } from "next";
import { Source_Sans_3 as FontSans } from "next/font/google";
import "./globals.css";
import "./brain-decorations.css";
import Header from "@/components/ui/common/header";
import Footer from "@/components/ui/common/footer";
import { ClerkProvider } from "@clerk/nextjs";
import { NotificationProvider } from "@/components/ui/common/notification-provider";
import { AnalyticsProvider } from "@/lib/analytics";
import { Suspense } from "react";
import { getDefaultMetadata, getMetadataBase, getOpenGraph } from "@/lib/utils";

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
    <html lang="en" className="scroll-smooth">
      <body className={`${fontSans.variable} font-sans antialiased`}>
        <NotificationProvider>
          <div className="relative flex min-h-screen flex-col">
           {/* Brain decorations */}
           <img src="/blue.png" alt="" className="brain-decoration blue-brain-1" />
           <img src="/blue.png" alt="" className="brain-decoration blue-brain-2" />
           <img src="/blue.png" alt="" className="brain-decoration blue-brain-3" />
           <img src="/blue.png" alt="" className="brain-decoration blue-brain-4" />
           <img src="/blue.png" alt="" className="brain-decoration blue-brain-5" />
           <img src="/colorful.png" alt="" className="brain-decoration colorful-brain-1" />
           <img src="/colorful.png" alt="" className="brain-decoration colorful-brain-2" />
           <img src="/colorful.png" alt="" className="brain-decoration colorful-brain-3" />
           <img src="/colorful.png" alt="" className="brain-decoration colorful-brain-4" />
           <img src="/colorful.png" alt="" className="brain-decoration colorful-brain-5" />
           <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-primary focus:text-white focus:z-50">
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
      </body>
    </html>
   </ClerkProvider>
  );
}
