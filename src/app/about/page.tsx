import Link from 'next/link'
import styles from './About.module.css'

export default function AboutPage() {
    return (
        <div className={styles.container}>
            <Link href="/" className={styles.backLink}>
                <span>←</span> Back to Home
            </Link>

            <main className={styles.card}>
                <h1 className={styles.title}>About the Company</h1>

                <div className={styles.content}>
                    <p>
                        <strong className={styles.legalName}>E-Ogaysii Technology</strong> is a legally registered company providing marketing solutions, WhatsApp customer notification systems, and bespoke web and software development specifically tailored for small and medium businesses.
                    </p>

                    <p>
                        <strong className={styles.legalName}>E-Ogaysii</strong> is a flagship product operated and managed by E-Ogaysii Technology, designed to bridge the communication gap between businesses and their clients through seamless WhatsApp integration.
                    </p>

                    <section className={styles.contactSection}>
                        <h2 className={styles.contactTitle}>Contact Block</h2>
                        <div className={styles.contactGrid}>
                            <div className={styles.contactItem}>
                                <h4>Legal Business Name</h4>
                                <p className={styles.legalName}>E-Ogaysii Technology</p>
                            </div>
                            <div className={styles.contactItem}>
                                <h4>Email</h4>
                                <p>info@e-ogaysii.com</p>
                            </div>
                            <div className={styles.contactItem}>
                                <h4>Phone</h4>
                                <p>+252610667835</p>
                            </div>
                            <div className={styles.contactItem}>
                                <h4>Address</h4>
                                <p>Kismayo, Somalia</p>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <footer className={styles.footer}>
                <p>© 2026 E-Ogaysii Technology. All rights reserved.</p>
            </footer>
        </div>
    )
}
