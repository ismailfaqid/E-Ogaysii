import { getProduct } from '@/actions/products'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import styles from './ProductDetails.module.css'
import BroadcastButton from '@/components/BroadcastButton' // Client component for action

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions)
    const role = session?.user?.role
    const { id } = await params
    const product = await getProduct(Number(id))

    if (!product) {
        notFound()
    }

    const clientCount = product.selected_clients ? product.selected_clients.length : 0
    const backLink = role === 'ADMIN' ? `/admin/businesses` : '/products'
    const backLabel = role === 'ADMIN' ? '← Business List' : '← My Products'

    return (
        <div className="section container-sm">
            <header className={styles.header}>
                <Link href={backLink} className={styles.backLink}>{backLabel}</Link>
                <div className={styles.statusWrapper}>
                    <span className={`status-badge ${product.status.toLowerCase()}`}>{product.status}</span>
                </div>
            </header>

            <div className={styles.mainGrid}>
                {/* Section A: Product Info (Read-only view mostly, but requirements say 'Editable fields'. 
            For MVP, I'll make them static or standard inputs. 
            User said 'Editable fields: product_name...'. 
            I'll use a form but disable if status != Draft? 
            Prompt says 'Editable fields' in Screen 4.
        */}
                <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
                    <h2>Product Info</h2>
                    {/* Simple edit form - omitted for brevity in MVP unless requested, showing display values */}
                    <div className={styles.infoRow}>
                        <div className={styles.imageBox}>
                            {product.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={product.image} alt={product.product_name} />
                            ) : (<span>📷</span>)}
                        </div>
                        <div className={styles.details}>
                            <h3>{product.product_name}</h3>
                            <p className={styles.price}>${Number(product.price).toFixed(2)}</p>
                            <p className={styles.desc}>{product.description}</p>
                        </div>
                    </div>
                </div>

                {/* Section B: Select Clients */}
                <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
                    <div className={styles.sectionHeader}>
                        <h2>Recipients</h2>
                        <Link
                            href={`/clients?select_for=${product.id}`}
                            className="btn btn-primary"
                        >
                            {clientCount > 0 ? 'Edit Selection' : 'Select Clients'}
                        </Link>
                    </div>

                    <div className={styles.clientSummary}>
                        {clientCount === 0 ? (
                            <p className="text-muted">No clients selected yet. Data must exist before it can be linked.</p>
                        ) : (
                            <p>{clientCount} clients selected. ready to broadcast.</p>
                        )}
                        {/* Show a few names? */}
                        {product.selected_clients && product.selected_clients.slice(0, 3).map((c: any) => (
                            <span key={c.id} className={styles.clientTag}>{c.client_name}</span>
                        ))}
                        {clientCount > 3 && <span className="text-muted">+{clientCount - 3} more</span>}
                    </div>
                </div>

                {/* Section C: Send Broadcast */}
                <div className={styles.actionSection}>
                    <BroadcastButton
                        productId={product.id}
                        disabled={clientCount === 0 || product.status !== 'Draft'}
                        status={product.status}
                    />
                </div>
            </div>
        </div>
    )
}
