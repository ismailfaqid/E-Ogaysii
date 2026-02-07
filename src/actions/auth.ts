'use server'

import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { redirect } from "next/navigation"

export async function registerUser(formData: FormData) {
    try {
        const email = formData.get("email")?.toString()
        const password = formData.get("password")?.toString()
        const name = formData.get("name")?.toString()

        console.log("Registration attempt for:", email)

        if (!email || !password || !name) {
            return { success: false, message: "All fields are required" }
        }

        // 1. Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            console.log("User already exists:", email)
            return { success: false, message: "User already exists" }
        }

        // 2. Hash password
        console.log("Hashing password...")
        const hashedPassword = await hash(password, 10)

        // 3. Create user
        console.log("Creating user in DB...")
        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: "BUSINESS",
                name
            }
        })

        console.log("Registration successful for:", email)
        return { success: true }
    } catch (e: any) {
        console.error("CRITICAL Registration Error:", e)
        // Check for common Prisma connection issues
        if (e.message?.includes("Can't reach database server")) {
            return { success: false, message: "Database connection failed. Please check your DATABASE_URL." }
        }
        return { success: false, message: `Registration failed: ${e.message || "Unknown error"}` }
    }
}
