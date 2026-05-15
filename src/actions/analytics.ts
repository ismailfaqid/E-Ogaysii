'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

/**
 * Calculates broadcast analytics for the current business
 */
export async function getBroadcastAnalytics() {
    const session = await getServerSession(authOptions)
    const email = session?.user?.email
    const role = session?.user?.role
    
    if (!email) return null

    // Admin sees everything, Business sees only their own
    const where: any = {}
    if (role !== 'ADMIN') {
        where.businessEmail = email
    }

    const broadcasts = await prisma.broadcast.findMany({
        where,
        include: {
            recipients: true
        },
        orderBy: {
            sentAt: 'desc'
        }
    })

    let totalRecipients = 0
    let deliveredCount = 0
    let readCount = 0
    let failedCount = 0
    let sentCount = 0

    broadcasts.forEach(b => {
        b.recipients.forEach(r => {
            totalRecipients++
            if (r.status === 'sent') sentCount++
            if (r.status === 'delivered') deliveredCount++
            if (r.status === 'read') {
                deliveredCount++ // Read implies delivered
                readCount++
            }
            if (r.status === 'failed') failedCount++
        })
    })

    const deliveryRate = totalRecipients > 0 ? ((deliveredCount) / totalRecipients) * 100 : 0
    const readRate = deliveredCount > 0 ? (readCount / deliveredCount) * 100 : 0

    return {
        totalBroadcasts: broadcasts.length,
        totalRecipients,
        sentCount,
        deliveredCount,
        readCount,
        failedCount,
        deliveryRate: Math.round(deliveryRate),
        readRate: Math.round(readRate),
        recentBroadcasts: broadcasts.slice(0, 5).map(b => ({
            id: b.id,
            date: b.sentAt,
            status: b.status,
            recipientCount: b.recipients.length,
            failedCount: b.recipients.filter(r => r.status === 'failed').length
        }))
    }
}
