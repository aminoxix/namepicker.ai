import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isAuthRoute = createRouteMatcher(["/"]);

export default clerkMiddleware((auth, req: NextRequest) => {
  const { userId, redirectToSignIn } = auth();

  if (isAuthRoute(req)) {
    return userId ? NextResponse.redirect(new URL("/playground", req.url)) : NextResponse.next();
  }

  return userId ? NextResponse.next() : redirectToSignIn({ returnBackUrl: req.url });
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
