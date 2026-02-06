'use client'

import { broadcastProduct } from '@/actions/products'
import { useState } from 'react'

export default function BroadcastButton({ productId, disabled, status }: { productId: number, disabled: boolean, status: string }) {
    const [loading, setLoading] = useState(false)

    async function handleBroadcast() {
        if (!confirm('Are you sure you want to send this broadcast to all selected clients?')) return

        setLoading(true)
        const res = await broadcastProduct(productId)
        if (res.success) {
            alert('Broadcast Sent!')
        } else {
            alert('Failed to send')
        }
        setLoading(false)
    }

    if (status === 'Sent') {
        return <button className="btn" disabled style={{ background: '#D1FAE5', color: '#059669', cursor: 'default' }}>Broadcast Sent</button>
    }

    return (
        <button
            className="btn btn-primary"
            onClick={handleBroadcast}
            disabled={disabled || loading}
            style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}
        >
            {loading ? 'Sending...' : 'Send Broadcast 🚀'}
        </button>
    )
}
