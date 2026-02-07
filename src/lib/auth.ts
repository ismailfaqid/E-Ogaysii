import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"

if (process.env.NODE_ENV === 'production' && !process.env.NEXTAUTH_SECRET) {
    console.warn("WARNING: NEXTAUTH_SECRET is missing in production environment!")
}

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
    cookies: {
        sessionToken: {
            name: `next-auth.session-token.wp`, // Added version suffix to bypass old stuck cookies
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production'
            }
        }
    },
    pages: {
        signIn: "/login",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                })

                if (!user) {
                    return null
                }

                const isPasswordValid = await compare(credentials.password, user.password)

                if (!isPasswordValid) {
                    return null
                }

                return {
                    id: user.id.toString(),
                    email: user.email,
                    role: user.role,
                    name: user.name,
                    image: user.image
                }
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            if (session.user && token) {
                session.user.id = token.id
                session.user.role = token.role
                session.user.name = token.name
                session.user.image = token.picture
            }
            return session
        },
        async jwt({ token, user, trigger, session }) {
            // Handle session update
            if (trigger === "update" && session) {
                if (session.user?.name) token.name = session.user.name
                if (session.user?.image) token.picture = session.user.image
            }

            // Initial sign in
            if (user) {
                token.id = user.id.toString()
                token.role = user.role
                token.name = user.name
                token.picture = user.image
            }
            return token
        }
    }
}
