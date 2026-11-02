import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PATHFINDER AI | Campus-to-Employment Opportunity Matcher",
  description: "Talent Has No Location. Opportunity Shouldn't Either. Role-Based Verification & Anti-Bias Opportunity Matcher.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#FAF8F5] text-[#121212] min-h-screen selection:bg-[#121212] selection:text-[#FAF8F5]`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
