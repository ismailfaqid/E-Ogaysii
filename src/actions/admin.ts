'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function approveBroadcast(productId: number) {
    try {
        await prisma.product.update({
            where: { id: productId },
            data: { status: "Sent" } // In a real app, this would trigger the actual sending service
        })
        revalidatePath('/admin')
        return { success: true }
    } catch (e) {
        return { success: false }
    }
}

export async function rejectBroadcast(productId: number) {
    try {
        await prisma.product.update({
            where: { id: productId },
            data: { status: "Draft" } // Revert to draft
        })
        revalidatePath('/admin')
        return { success: true }
    } catch (e) {
        return { success: false }
    }
}
