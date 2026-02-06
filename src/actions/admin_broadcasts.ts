'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function getGlobalBroadcasts() {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'ADMIN') {
        throw new Error("Unauthorized")
    }

    return await prisma.broadcast.findMany({
        orderBy: {
            sentAt: 'desc'
        },
        include: {
            business: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true
                }
            },
            product: {
                select: {
                    id: true,
                    product_name: true,
                    image: true,
                    price: true
                }
            },
            _count: {
                select: {
                    clients: true
                }
            }
        }
    })
}

export async function getBroadcastStats() {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'ADMIN') {
        throw new Error("Unauthorized")
    }

    const totalBroadcasts = await prisma.broadcast.count()
    const recentBroadcasts = await prisma.broadcast.count({
        where: {
            sentAt: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
            }
        }
    })

    return {
        totalBroadcasts,
        recentBroadcasts
    }
}
