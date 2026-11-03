import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

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
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700;800&display=swap"
            rel="stylesheet"
          />
        </head>
        <body
          className="font-sans antialiased bg-[#F7F8FF] text-[#0D0B2D] min-h-screen selection:bg-[#5B4BFF] selection:text-white"
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
