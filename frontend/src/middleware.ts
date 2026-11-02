import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
  const secretKey = process.env.CLERK_SECRET_KEY;
  // If secret key is not configured or partially masked, gracefully allow requests
  if (!secretKey || secretKey.includes("…") || secretKey === "sk_test_placeholder_key") {
    return NextResponse.next();
  }

  return (clerkMiddleware() as any)(req);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
