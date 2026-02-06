'use client'

import { approveBroadcast, rejectBroadcast } from "@/actions/admin"
import { useRouter } from "next/navigation"

export default function AdminProductActions({ productId }: { productId: number }) {
    const router = useRouter()

    async function handleApprove() {
        if (!confirm('Approve this broadcast?')) return
        await approveBroadcast(productId)
        router.refresh()
    }

    async function handleReject() {
        if (!confirm('Reject this broadcast?')) return
        await rejectBroadcast(productId)
        router.refresh()
    }

    return (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleApprove} className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem', backgroundColor: '#10b981' }}>Approve</button>
            <button onClick={handleReject} className="btn" style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem', backgroundColor: '#ef4444', color: 'white' }}>Reject</button>
        </div>
    )
}
