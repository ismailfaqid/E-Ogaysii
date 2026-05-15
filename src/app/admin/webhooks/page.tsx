'use client'

import { useState, useEffect } from "react"

export default function WebhooksPage() {
    const [logs, setLogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // In a real app, this would be a server action
        async function load() {
            // Mocking or using a server action if created
            setLoading(false)
        }
        load()
    }, [])

    return (
        <div className="section animate-fade-in">
            <div className="container">
                <h1 style={{ marginBottom: '2rem' }}>Webhook Monitoring</h1>

                <div className="grid-layout" style={{ gridTemplateColumns: '1fr 2fr' }}>
                    {/* Health Status */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Endpoint Status</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981' }}></div>
                                <span style={{ fontWeight: 600, color: '#065F46' }}>Healthy / Active</span>
                            </div>
                            <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                                Receiving events from Meta Cloud API.
                            </p>
                        </div>

                        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Webhook Configuration</h3>
                            <p style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}><strong>Version:</strong> v21.0</p>
                            <p style={{ fontSize: '0.8rem' }}><strong>Subscriptions:</strong> messages, message_statuses</p>
                        </div>
                    </div>

                    {/* Event Logs */}
                    <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Recent Events</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <p className="text-muted" style={{ textAlign: 'center', padding: '2rem' }}>
                                Real-time logs will appear here as webhooks are received.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
