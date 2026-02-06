'use server'

import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { redirect } from "next/navigation"

export async function registerUser(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const name = formData.get("name") as string

    // Basic validation
    if (!email || !password || !name) {
        return { success: false, message: "All fields are required" }
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { email }
    })

    if (existingUser) {
        return { success: false, message: "User already exists" }
    }

    const hashedPassword = await hash(password, 10)

    try {
        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: "BUSINESS",
                name
            }
        })
    } catch (e) {
        console.error("Registration Error:", e)
        return { success: false, message: "Registration failed" }
    }

    return { success: true }
}
