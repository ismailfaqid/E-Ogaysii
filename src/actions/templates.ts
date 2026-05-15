'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from 'next/cache'

async function getEmail() {
    const session = await getServerSession(authOptions)
    return session?.user?.email
}

/**
 * Retrieves all WhatsApp templates for the current business
 */
export async function getTemplates() {
    const email = await getEmail()
    if (!email) return []

    return await prisma.whatsAppTemplate.findMany({
        where: { business_email: email },
        orderBy: { createdAt: 'desc' }
    })
}

/**
 * Saves a new approved template name to the database
 */
export async function saveTemplate(prevState: any, formData: FormData) {
    const email = await getEmail()
    if (!email) return { success: false, message: "Unauthorized" }

    const name = formData.get('name') as string
    const language = formData.get('language') as string || 'en_US'
    const category = formData.get('category') as string || 'MARKETING'

    if (!name) return { success: false, message: "Template name is required" }

    try {
        await prisma.whatsAppTemplate.create({
            data: {
                business_email: email,
                name: name.trim(),
                language,
                category
            }
        })

        // Audit log
        await prisma.auditLog.create({
            data: {
                action: 'ADD_TEMPLATE',
                userEmail: email,
                details: `Added template: ${name}`
            }
        })

        revalidatePath('/admin/templates')
        return { success: true, message: "Template added successfully" }
    } catch (e) {
        console.error('[Templates] Save failed:', e)
        return { success: false, message: "Failed to add template" }
    }
}

/**
 * Deletes a template
 */
export async function deleteTemplate(id: number) {
    const email = await getEmail()
    if (!email) return { success: false }

    try {
        await prisma.whatsAppTemplate.delete({
            where: { id, business_email: email }
        })
        revalidatePath('/admin/templates')
        return { success: true }
    } catch (e) {
        return { success: false }
    }
}
