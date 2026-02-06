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

    try {
        await prisma.client.create({
            data: {
                client_name: name,
                whatsapp_number: phone,
                business_email: email
            }
        })
        revalidatePath('/clients')
        return { message: 'Client created', success: true }
    } catch (e) {
        console.error(e)
        return { message: 'Failed to create client' }
    }
}
