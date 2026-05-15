'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { whatsappService } from '@/lib/whatsapp'

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
            selected_clients: true
        }
    })
}

export async function getProduct(id: number) {
    const session = await getServerSession(authOptions)
    const email = session?.user?.email
    const role = session?.user?.role

    if (!email) return null

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
            const base64Image = buffer.toString('base64')
            const contentType = imageFile.type || 'image/jpeg'
            imageUrl = `data:${contentType};base64,${base64Image}`
        } catch (e) {
            console.error("Base64 conversion failed", e)
        }
    } else {
        imageUrl = formData.get('image') as string
    }

    try {
        const product = await prisma.product.create({
            data: {
                product_name: name,
                price: parseFloat(price) || 0,
                description: description || "",
                image: imageUrl,
                status: "Draft",
                business_email: email
            }
        })

        // Audit log
        await prisma.auditLog.create({
            data: {
                action: 'CREATE_PRODUCT',
                userEmail: email,
                details: `Created product: ${name}`
            }
        })

        return { success: true, productId: product.id }
    } catch (e) {
        console.error(e)
        return { success: false, message: 'Failed to create product' }
    }
}

export async function updateProductClients(productId: number, clientIds: number[]) {
    const email = await getUserEmail()
    if (!email) return { success: false }

    try {
        await prisma.product.update({
            where: { id: productId },
            data: {
                selected_clients: {
                    set: clientIds.map(id => ({ id }))
                }
            }
        })

        // Audit log
        await prisma.auditLog.create({
            data: {
                action: 'UPDATE_PRODUCT_CLIENTS',
                userEmail: email,
                details: `Updated client list for product ID: ${productId}`
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
        if (product.selected_clients.length === 0) return { success: false, message: "No clients selected" }

        // 1. Create the broadcast record with 'queued' status
        const broadcast = await prisma.broadcast.create({
            data: {
                productId: productId,
                businessEmail: product.business_email,
                status: "queued",
                clients: {
                    connect: product.selected_clients.map(c => ({ id: c.id }))
                }
            }
        })

        // 2. Queue broadcasts sequentially
        for (const client of product.selected_clients) {
            try {
                // Approved Meta message template: product_notification
                const templateName = "product_notification"; 
                
                let response;
                if (product.image && product.image.startsWith('http')) {
                    // Send image-based template message
                    response = await whatsappService.sendImageTemplateMessage(
                        client.whatsapp_number,
                        templateName,
                        product.image,
                        [product.product_name, product.price.toString()]
                    );
                } else {
                    // Send text-only template message
                    response = await whatsappService.sendTemplateMessage(
                        client.whatsapp_number,
                        templateName,
                        [
                            {
                                type: 'body',
                                parameters: [
                                    { type: 'text', text: product.product_name },
                                    { type: 'text', text: product.price.toString() }
                                ]
                            }
                        ]
                    );
                }

                const messageId = response.messages[0].id;

                // 3. Save delivery status to BroadcastRecipient table
                await prisma.broadcastRecipient.create({
                    data: {
                        broadcastId: broadcast.id,
                        clientId: client.id,
                        whatsapp_message_id: messageId,
                        status: "sent"
                    }
                });

            } catch (error: any) {
                console.error(`[Broadcast] Failed to send to ${client.whatsapp_number}:`, error.message);
                
                await prisma.broadcastRecipient.create({
                    data: {
                        broadcastId: broadcast.id,
                        clientId: client.id,
                        status: "failed",
                        errorMessage: error.message
                    }
                });
            }
        }

        // 4. Update overall broadcast status
        await prisma.broadcast.update({
            where: { id: broadcast.id },
            data: { status: "completed" }
        })

        await prisma.product.update({
            where: { id: productId },
            data: { status: "Sent" }
        })

        revalidatePath(`/products/${productId}`)
        revalidatePath(`/products`)
        return { success: true }
    } catch (e) {
        console.error("[Broadcast] Critical failure:", e)
        return { success: false, message: "Broadcast failed" }
    }
}
