import { getGlobalBroadcasts, getBroadcastStats } from "@/actions/admin_broadcasts"
import Link from "next/link"
import styles from "../Admin.module.css"

export default async function AdminBroadcastsPage() {
    const broadcasts = await getGlobalBroadcasts()
    const { totalBroadcasts, recentBroadcasts } = await getBroadcastStats()

    return (
        <div className={styles.detailPage}>
            <div className={styles.sectionHeader}>
                <div>
                    <h1 className={styles.sectionTitle}>Broadcast Oversight</h1>
                    <p className="text-muted">Monitor all product broadcasts across the platform</p>
                </div>
                <Link href="/admin" className={styles.backBtn}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>
                    Dashboard
                </Link>
            </div>

            <div className={styles.statsRow}>
                <div className={styles.miniStatCard}>
                    <span className={styles.miniStatLabel}>Total Broadcasts</span>
                    <span className={styles.miniStatValue}>{totalBroadcasts}</span>
                </div>
                <div className={styles.miniStatCard}>
                    <span className={styles.miniStatLabel}>Last 24 Hours</span>
                    <span className={styles.miniStatValue}>{recentBroadcasts}</span>
                </div>
                <div className={styles.miniStatCard}>
                    <span className={styles.miniStatLabel}>WhatsApp Status</span>
                    <span className={styles.miniStatValue} style={{ color: '#10B981' }}>Connected</span>
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.productTableWrapper}>
                    <table className={styles.productTable}>
                        <thead>
                            <tr>
                                <th>Sent At</th>
                                <th>Business (Sender)</th>
                                <th>Product</th>
                                <th>Recipients</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {broadcasts.map((b) => (
                                <tr key={b.id}>
                                    <td style={{ whiteSpace: 'nowrap' }}>
                                        {new Date(b.sentAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                    </td>
                                    <td>
                                        <div className={styles.productInfo}>
                                            <div className={styles.productThumb} style={{ borderRadius: '50%' }}>
                                                {b.business.image ? <img src={b.business.image} alt="" /> : <span>👤</span>}
                                            </div>
                                            <div>
                                                <Link href={`/admin/businesses/${b.business.id}`} className={styles.businessLinkName}>
                                                    {b.business.name || b.business.email.split('@')[0]}
                                                </Link>
                                                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{b.business.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.productInfo}>
                                            <div className={styles.productThumb}>
                                                {b.product.image ? <img src={b.product.image} alt="" /> : <span>📦</span>}
                                            </div>
                                            <Link href={`/products/${b.product.id}`} className={styles.productLinkName}>
                                                {b.product.product_name}
                                            </Link>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{b._count.clients} Clients</div>
                                        <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                                            {b.recipients.filter((r: any) => r.status === 'delivered' || r.status === 'read').length} Deliv. • {b.recipients.filter((r: any) => r.status === 'read').length} Read
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`${styles.badge} ${b.status === 'completed' ? styles.approved : styles.pending}`}>
                                            {b.status}
                                        </span>
                                        {b.recipients.some((r: any) => r.status === 'failed') && (
                                            <div style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.5rem', background: '#FEF2F2', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #FEE2E2' }}>
                                                <strong>Error:</strong> {b.recipients.find((r: any) => r.status === 'failed')?.errorMessage || 'Unknown error'}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {broadcasts.length === 0 && (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>
                                        No broadcasts have been sent yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
