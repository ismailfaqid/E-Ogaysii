import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token
        const path = req.nextUrl.pathname

        // Admin protection
        if (path.startsWith("/admin") && token?.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/products", req.url))
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token
        },
        secret: process.env.NEXTAUTH_SECRET,
    }
)

export const config = {
    matcher: ["/products/:path*", "/clients/:path*", "/admin/:path*", "/settings/:path*"]
}
