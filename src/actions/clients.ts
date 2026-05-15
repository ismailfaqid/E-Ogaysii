'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

async function getUserEmail() {
    const session = await getServerSession(authOptions)
    return session?.user?.email
}

export async function getClients() {
    const session = await getServerSession(authOptions)
    const email = session?.user?.email
    const role = session?.user?.role

    if (!email) return []

    // Admins can see all clients, Businesses only their own
    const where: any = {}
    if (role !== 'ADMIN') {
        where.business_email = email
    }

    return await prisma.client.findMany({
        where,
        orderBy: {
            id: 'desc'
        }
    })
}

export async function createClient(prevState: any, formData: FormData) {
    const name = formData.get('client_name') as string
    const phone = formData.get('whatsapp_number') as string
    const email = await getUserEmail()

    if (!email) return { message: 'Unauthorized' }

    if (!name || !phone) {
        return { message: 'Name and Phone are required' }
    }

    if (!validateWhatsAppNumber(phone)) {
        return { message: 'Invalid WhatsApp number format (10-15 digits required)' }
    }

    try {
        // Check for duplicate number for this business
        const existing = await prisma.client.findFirst({
            where: {
                whatsapp_number: phone,
                business_email: email
            }
        })

        if (existing) {
            return { message: 'A client with this number already exists' }
        }

        await prisma.client.create({
            data: {
                client_name: name,
                whatsapp_number: phone,
                business_email: email
            }
        })

        // Audit log
        await prisma.auditLog.create({
            data: {
                action: 'CREATE_CLIENT',
                userEmail: email,
                details: `Created client: ${name} (${phone})`
            }
        })

        revalidatePath('/clients')
        return { message: 'Client created', success: true }
    } catch (e) {
        console.error(e)
        return { message: 'Failed to create client' }
    }
}

function validateWhatsAppNumber(phone: string) {
    // Basic validation: 10 to 15 digits
    const regex = /^\d{10,15}$/
    return regex.test(phone.replace(/\D/g, ''))
}
