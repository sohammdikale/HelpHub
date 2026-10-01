import type { Metadata, Viewport } from "next";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "HelpHun — Find Help Nearby | Hyperlocal Micro-Job Marketplace India",
  description:
    "Find trusted, skilled, and semi-skilled workers nearby for everyday tasks: plumbing, cleaning, repairs, electrical, delivery, moving, and more. Fair pay, instant UPI withdrawals, and verified profiles.",
  keywords: [
    "HelpHun",
    "hyperlocal jobs India",
    "find help nearby",
    "plumber Delhi",
    "electrician near me",
    "maid cleaning service",
    "micro jobs",
    "daily wage work",
    "Surepass KYC",
    "Razorpay UPI",
  ],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#0F172A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-teal-500 selection:text-white">
        <StoreProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
