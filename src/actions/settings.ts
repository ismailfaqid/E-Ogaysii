'use server'

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { hash, compare } from "bcryptjs"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

async function getUser() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return null
    return await prisma.user.findUnique({ where: { email: session.user.email } })
}

export async function changePassword(prevState: any, formData: FormData) {
    const currentPassword = formData.get("current_password") as string
    const newPassword = formData.get("new_password") as string
    const confirmPassword = formData.get("confirm_password") as string

    if (!currentPassword || !newPassword || !confirmPassword) {
        return { success: false, message: "All fields are required" }
    }

    if (newPassword !== confirmPassword) {
        return { success: false, message: "New passwords do not match" }
    }

    const user = await getUser()
    if (!user) return { success: false, message: "Unauthorized" }

    const isMatch = await compare(currentPassword, user.password)
    if (!isMatch) {
        return { success: false, message: "Incorrect current password" }
    }

    const hashedPassword = await hash(newPassword, 10)
    await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
    })

    return { success: true, message: "Password updated successfully" }
}

export async function updateEmail(prevState: any, formData: FormData) {
    const newEmail = formData.get("new_email") as string

    if (!newEmail) return { success: false, message: "Email is required" }

    const user = await getUser()
    if (!user) return { success: false, message: "Unauthorized" }

    // Check if new email exists
    const existing = await prisma.user.findUnique({ where: { email: newEmail } })
    if (existing) {
        return { success: false, message: "Email already in use" }
    }

    try {
        await prisma.user.update({
            where: { id: user.id },
            data: { email: newEmail }
        })
        return { success: true, message: "Email updated. Please login again." }
    } catch (e) {
        console.error(e)
        return { success: false, message: "Failed to update email" }
    }
}
