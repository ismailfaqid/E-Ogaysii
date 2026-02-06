import { prisma } from "@/lib/prisma"
import Link from "next/link"
import AdminSearch from "../AdminSearch"
import AdminUserActions from "@/components/AdminUserActions"
import styles from "../Admin.module.css"

export default async function AdminBusinessesPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const { q = "" } = await searchParams

    const businesses = await prisma.user.findMany({
        where: {
            role: "BUSINESS",
            OR: [
                { name: { contains: q } },
                { email: { contains: q } }
            ]
        },
        orderBy: { id: 'desc' }
    })

    return (
        <div className={styles.businessesPage}>
            <div className={styles.sectionHeader}>
                <div>
                    <h1 className={styles.sectionTitle}>All Businesses</h1>
                    <p className="text-muted">Manage and inspect all registered businesses</p>
                </div>
                <Link href="/admin" className={styles.backBtn}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>
                    Dashboard
                </Link>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <AdminSearch />
            </div>

            <div className={styles.businessListFull}>
                {businesses.map((biz) => (
                    <div key={biz.id} className={styles.businessCard}>
                        <Link href={`/admin/businesses/${biz.id}`} className={styles.businessInfoLink}>
                            <div className={styles.businessAvatar}>
                                {biz.image ? (
                                    <img src={biz.image} alt="" className={styles.businessAvatarImg} />
                                ) : (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" /></svg>
                                )}
                            </div>
                            <div className={styles.businessInfo}>
                                <h3 className={styles.businessName}>{biz.name || biz.email.split('@')[0]}</h3>
                                <p className={styles.businessEmail}>{biz.email}</p>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                                    <span className={`${styles.badge} ${styles[biz.status.toLowerCase()]}`}>
                                        {biz.status}
                                    </span>
                                    <span className={styles.badge} style={{ background: '#E5E7EB', color: '#374151' }}>
                                        {biz.role}
                                    </span>
                                </div>
                            </div>
                        </Link>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Link href={`/admin/businesses/${biz.id}`} className={styles.viewBtn}>View</Link>
                            <AdminUserActions userId={biz.id} status={biz.status} />
                        </div>
                    </div>
                ))}
                {businesses.length === 0 && (
                    <div className={styles.emptyState}>
                        <p>No businesses found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
