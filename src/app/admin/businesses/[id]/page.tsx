import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import AdminUserActions from "@/components/AdminUserActions"
import styles from "../../Admin.module.css"

export default async function BusinessDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const bizId = parseInt(id)

    if (isNaN(bizId)) return notFound()

    const business = await prisma.user.findUnique({
        where: { id: bizId },
        include: {
            products: {
                orderBy: { id: 'desc' }
            },
            clients: true,
            broadcasts: true,
        }
    })

    if (!business || business.role !== 'BUSINESS') return notFound()

    return (
        <div className={styles.detailPage}>
            <div className={styles.detailHeader}>
                <Link href="/admin" className={styles.backBtn}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>
                    Back to Dashboard
                </Link>
                <div className={styles.headerInfo}>
                    <div className={styles.avatarLarge}>
                        {business.image ? (
                            <img src={business.image} alt="" />
                        ) : (
                            <span>{business.name?.[0] || 'B'}</span>
                        )}
                    </div>
                    <div>
                        <h1 className={styles.detailTitle}>{business.name || 'Unnamed Business'}</h1>
                        <p className={styles.detailSubtitle}>{business.email}</p>
                    </div>
                </div>
                <div className={styles.headerActions}>
                    <AdminUserActions userId={business.id} status={business.status} />
                </div>
            </div>

            <div className={styles.statsRow}>
                <div className={styles.miniStatCard}>
                    <span className={styles.miniStatLabel}>Total Clients</span>
                    <span className={styles.miniStatValue}>{business.clients.length}</span>
                </div>
                <div className={styles.miniStatCard}>
                    <span className={styles.miniStatLabel}>Total Products</span>
                    <span className={styles.miniStatValue}>{business.products.length}</span>
                </div>
                <div className={styles.miniStatCard}>
                    <span className={styles.miniStatLabel}>Broadcasts</span>
                    <span className={styles.miniStatValue}>{business.broadcasts.length}</span>
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Products Catalog</h2>
                <div className={styles.productTableWrapper}>
                    <table className={styles.productTable}>
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {business.products.map((product) => (
                                <tr key={product.id}>
                                    <td>
                                        <div className={styles.productInfo}>
                                            <div className={styles.productThumb}>
                                                {product.image ? <img src={product.image} alt="" /> : <span>📦</span>}
                                            </div>
                                            {product.product_name}
                                        </div>
                                    </td>
                                    <td>${Number(product.price).toFixed(2)}</td>
                                    <td>
                                        <span className={`${styles.badge} ${styles[product.status.toLowerCase()]}`}>
                                            {product.status === 'Pending' ? 'Sent' : product.status}
                                        </span>
                                    </td>
                                    <td>{product.createdAt ? new Date(product.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {business.products.length === 0 && (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#6B7280' }}>
                                        No products created yet.
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
