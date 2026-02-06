import Link from 'next/link'
import { getProducts } from '@/actions/products'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import styles from './Products.module.css'

export default async function ProductsPage() {
    const session = await getServerSession(authOptions)
    const products = await getProducts()

    const hasNoName = !session?.user?.name || session.user.name === session.user.email

    return (
        <div className="section">
            {hasNoName && (
                <div style={{
                    background: '#FEF3C7',
                    border: '1px solid #F59E0B',
                    color: '#92400E',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span><strong>Please complete your profile:</strong> Setting a business name helps your clients identify you.</span>
                    <Link href="/settings" className="btn btn-sm" style={{ background: '#F59E0B', color: 'white' }}>Fix Now</Link>
                </div>
            )}
            <header className={styles.header}>
                <div>
                    <h1>My Products</h1>
                    <p className="text-muted">Manage your catalog and broadcasts</p>
                </div>
                <Link href="/products/new" className="btn btn-primary">
                    + Add Product
                </Link>
            </header>

            <div className={styles.grid}>
                {products.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>No products found.</p>
                    </div>
                ) : (
                    products.map((p) => (
                        <Link key={p.id} href={`` + `/products/${p.id}`} className={styles.card}>
                            <div className={styles.imagePlaceholder}>
                                {p.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={p.image} alt={p.product_name} className={styles.img} />
                                ) : (
                                    <span className={styles.icon}>📷</span>
                                )}
                            </div>
                            <div className={styles.content}>
                                <div className={styles.row}>
                                    <h3 className={styles.title}>{p.product_name}</h3>
                                    <span className={`${styles.badge} ${styles[p.status.toLowerCase()]}`}>
                                        {p.status}
                                    </span>
                                </div>
                                <p className={styles.price}>${Number(p.price).toFixed(2)}</p>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    )
}
