'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

async function getUserEmail() {
    const session = await getServerSession(authOptions)
    return session?.user?.email
}

export async function getProducts() {
    const email = await getUserEmail()
    if (!email) return []

    return await prisma.product.findMany({
        where: {
            business_email: email
        },
        orderBy: {
            id: 'desc'
        },
        include: {
            selected_clients: true // Include for Client selection count or sending
        }
    })
}

export async function getProduct(id: number) {
    const session = await getServerSession(authOptions)
    const email = session?.user?.email
    const role = session?.user?.role

    if (!email) return null

    // Admins can see any product, Businesses only their own
    const where: any = { id }
    if (role !== 'ADMIN') {
        where.business_email = email
    }

    return await prisma.product.findFirst({
        where,
        include: {
            selected_clients: true
        }
    })
}

export async function createProduct(prevState: any, formData: FormData) {
    const email = await getUserEmail()
    if (!email) return { success: false, message: "Unauthorized" }

    const name = formData.get('product_name') as string
    const price = formData.get('price') as string
    const description = formData.get('description') as string
    const imageFile = formData.get('imageFile') as File

    let imageUrl = null

    if (imageFile && imageFile.size > 0) {
        try {
            const buffer = Buffer.from(await imageFile.arrayBuffer())
            const filename = Date.now() + '_' + imageFile.name.replaceAll(" ", "_")
            const uploadDir = path.join(process.cwd(), 'public/uploads')

            // Ensure directory exists
            await mkdir(uploadDir, { recursive: true })

            await writeFile(path.join(uploadDir, filename), buffer)
            imageUrl = `/uploads/${filename}`
        } catch (e) {
            console.error("Upload failed", e)
            // Continue without image or return error? Continue for now.
        }
    } else {
        // Fallback to URL input if provided (legacy)
        imageUrl = formData.get('image') as string
    }

    try {
        const product = await prisma.product.create({
            data: {
                product_name: name,
                price: parseFloat(price) || 0,
                description: description,
                image: imageUrl,
                status: "Draft",
                business_email: email
            }
        })
        return { success: true, productId: product.id }
    } catch (e) {
        console.error(e)
        return { success: false, message: 'Failed to create product' }
    }
}

export async function updateProductClients(productId: number, clientIds: number[]) {
    try {
        // We need to disconnect all first or manage differences
        // Simplest is 'set' if relation is m-n
        await prisma.product.update({
            where: { id: productId },
            data: {
                selected_clients: {
                    set: clientIds.map(id => ({ id }))
                }
            }
        })
        revalidatePath(`/products/${productId}`)
        return { success: true }
    } catch (e) {
        console.error(e)
        return { success: false }
    }
}

export async function broadcastProduct(productId: number) {
    try {
        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: { selected_clients: true }
        })

        if (!product) return { success: false, message: "Product not found" }

        // 1. Create the Broadcast record (History)
        await prisma.broadcast.create({
            data: {
                productId: productId,
                businessEmail: product.business_email,
                clients: {
                    connect: product.selected_clients.map(c => ({ id: c.id }))
                }
            }
        })

        // 2. Update status to Sent immediately (No Admin Approval needed)
        await prisma.product.update({
            where: { id: productId },
            data: { status: "Sent" }
        })

        // Trigger WhatsApp sending logic here (Async)
        revalidatePath(`/products/${productId}`)
        revalidatePath(`/products`)
        return { success: true }
    } catch (e) {
        console.error(e)
        return { success: false }
    }
}
