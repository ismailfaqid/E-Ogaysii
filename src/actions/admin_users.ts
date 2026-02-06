'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function toggleUserStatus(userId: number, currentStatus: string) {
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active'

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { status: newStatus }
        })
        revalidatePath('/admin')
        return { success: true }
    } catch (e) {
        return { success: false }
    }
}
