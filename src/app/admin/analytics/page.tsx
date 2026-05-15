'use client'

import { useState, useEffect } from "react"
import { getBroadcastAnalytics } from "@/actions/analytics"

export default function AnalyticsPage() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            const res = await getBroadcastAnalytics()
            setData(res)
            setLoading(false)
        }
        load()
    }, [])

    if (loading) return <div className="section">Loading analytics...</div>
    if (!data) return <div className="section">No data available.</div>

    return (
        <div className="section animate-fade-in">
            <div className="container">
                <h1 style={{ marginBottom: '2rem' }}>Broadcast Analytics</h1>

                {/* Stats Grid */}
                <div className="grid-layout" style={{ marginBottom: '3rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                        <p className="text-muted" style={{ fontSize: '0.875rem' }}>Total Broadcasts</p>
                        <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>{data.totalBroadcasts}</h2>
                    </div>
                    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                        <p className="text-muted" style={{ fontSize: '0.875rem' }}>Total Recipients</p>
                        <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>{data.totalRecipients}</h2>
                    </div>
                    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', borderBottom: '4px solid #10B981' }}>
                        <p className="text-muted" style={{ fontSize: '0.875rem' }}>Delivery Rate</p>
                        <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0', color: '#10B981' }}>{data.deliveryRate}%</h2>
                    </div>
                    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', borderBottom: '4px solid #3B82F6' }}>
                        <p className="text-muted" style={{ fontSize: '0.875rem' }}>Read Rate</p>
                        <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0', color: '#3B82F6' }}>{data.readRate}%</h2>
                    </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="grid-layout" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
                    <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Message Status Distribution</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <StatusRow label="Sent (Pending Status)" count={data.sentCount} total={data.totalRecipients} color="#94A3B8" />
                            <StatusRow label="Delivered" count={data.deliveredCount} total={data.totalRecipients} color="#10B981" />
                            <StatusRow label="Read" count={data.readCount} total={data.totalRecipients} color="#3B82F6" />
                            <StatusRow label="Failed" count={data.failedCount} total={data.totalRecipients} color="#EF4444" />
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Recent Activity</h3>
                        {data.recentBroadcasts.length === 0 ? (
                            <p className="text-muted">No recent broadcasts.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {data.recentBroadcasts.map((b: any) => (
                                    <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', borderBottom: '1px solid #E2E8F0' }}>
                                        <div>
                                            <p style={{ fontWeight: 500, margin: 0 }}>Broadcast #{b.id}</p>
                                            <p className="text-muted" style={{ fontSize: '0.75rem', margin: 0 }}>{new Date(b.date).toLocaleDateString()}</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ margin: 0 }}>{b.recipientCount} Recipients</p>
                                            {b.failedCount > 0 && <p style={{ color: '#EF4444', fontSize: '0.75rem', margin: 0 }}>{b.failedCount} Failed</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatusRow({ label, count, total, color }: any) {
    const percentage = total > 0 ? (count / total) * 100 : 0
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                <span>{label}</span>
                <span style={{ fontWeight: 600 }}>{count} ({Math.round(percentage)}%)</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${percentage}%`, height: '100%', background: color }}></div>
            </div>
        </div>
    )
}
