import { prisma } from "@/lib/prisma"
import AdminUserActions from "@/components/AdminUserActions"
import AdminSearch from "./AdminSearch"
import Link from "next/link"
import styles from "./Admin.module.css"

export default async function AdminDashboard({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const { q = "" } = await searchParams

    // Real counts from DB
    const businessCount = await prisma.user.count({ where: { role: "BUSINESS" } })
    const clientCount = await prisma.client.count()
    // Use the new Broadcast model for accurate history
    const broadcastCount = await prisma.broadcast.count()

    const businesses = await prisma.user.findMany({
        where: {
            role: "BUSINESS",
            OR: [
                { name: { contains: q } },
                { email: { contains: q } }
            ]
        },
        take: 5, // Show first 5 matches
        orderBy: { id: 'desc' }
    })

    return (
        <>
            {/* Stats Overview */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Businesses</span>
                    <div className={styles.statValueContainer}>
                        <span className={styles.statValue}>{businessCount}</span>
                        <span className={styles.statTrend}>+12%</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Total Clients</span>
                    <div className={styles.statValueContainer}>
                        <span className={styles.statValue}>{(clientCount / 1000).toFixed(1)}K</span>
                        <span className={styles.statTrend}>+5%</span>
                    </div>
                </div>
                <div className={`${styles.statCard} ${styles.statCardFull}`}>
                    <span className={styles.statLabel}>Broadcasts</span>
                    <div className={styles.statValueContainer}>
                        <span className={styles.statValue}>{(broadcastCount / 1000).toFixed(1)}K</span>
                        <span className={styles.statTrend}>+18%</span>
                    </div>
                </div>
            </div>

            {/* Search */}
            <AdminSearch />

            {/* Registered Businesses List */}
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Registered Businesses</h2>
                <Link href="/admin/businesses" className={styles.viewAll}>View All</Link>
            </div>

            <div className={styles.businessList}>
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
                            </div>
                        </Link>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Link href={`/admin/businesses/${biz.id}`} className={styles.viewBtn}>View</Link>
                            <AdminUserActions userId={biz.id} status={biz.status} />
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
