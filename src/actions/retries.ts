'use server'

import { prisma } from '@/lib/prisma'
import { whatsappService } from '@/lib/whatsapp'
import { revalidatePath } from 'next/cache'

/**
 * Retries a single failed recipient
 */
export async function retryRecipient(recipientId: number) {
    try {
        const recipient = await prisma.broadcastRecipient.findUnique({
            where: { id: recipientId },
            include: { 
                broadcast: { include: { product: true } },
                client: true
            }
        })

        if (!recipient) return { success: false, message: "Recipient not found" }

        const product = recipient.broadcast.product
        const client = recipient.client
        const templateName = "product_notification" // Default

        let response;
        if (product.image && product.image.startsWith('http')) {
            response = await whatsappService.sendImageTemplateMessage(
                client.whatsapp_number,
                templateName,
                product.image,
                [product.product_name, product.price.toString()]
            );
        } else {
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

        await prisma.broadcastRecipient.update({
            where: { id: recipientId },
            data: {
                whatsapp_message_id: messageId,
                status: "sent",
                errorMessage: null,
                retryCount: { increment: 1 }
            }
        })

        revalidatePath(`/admin/broadcasts`)
        return { success: true }
    } catch (e: any) {
        console.error(`[Retry] Failed for recipient ${recipientId}:`, e.message);
        
        await prisma.broadcastRecipient.update({
            where: { id: recipientId },
            data: {
                errorMessage: e.message,
                retryCount: { increment: 1 }
            }
        })
        
        return { success: false, message: e.message }
    }
}

/**
 * Retries all failed recipients for a specific broadcast
 */
export async function retryBroadcast(broadcastId: number) {
    const failedRecipients = await prisma.broadcastRecipient.findMany({
        where: {
            broadcastId,
            status: 'failed'
        }
    })

    if (failedRecipients.length === 0) return { success: true, count: 0 }

    let successCount = 0
    for (const recipient of failedRecipients) {
        const res = await retryRecipient(recipient.id)
        if (res.success) successCount++
    }

    revalidatePath(`/admin/broadcasts`)
    return { success: true, count: successCount }
}
