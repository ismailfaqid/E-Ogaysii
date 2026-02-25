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
                        <strong className={styles.legalName}>Deegaan Energy Solutions</strong> is a legally registered company providing electrical installation, solar energy systems, maintenance services, and supply of electrical and renewable energy equipment.
                    </p>

                    <p>
                        Beyond energy solutions, the company delivers a comprehensive suite of digital services including marketing solutions, WhatsApp customer notification systems, and bespoke web and software development specifically tailored for small and medium businesses.
                    </p>

                    <p>
                        <strong className={styles.legalName}>E-Ogaysii</strong> is a flagship product operated and managed by Deegaan Energy Solutions, designed to bridge the communication gap between businesses and their clients through seamless WhatsApp integration.
                    </p>

                    <section className={styles.contactSection}>
                        <h2 className={styles.contactTitle}>Contact Block</h2>
                        <div className={styles.contactGrid}>
                            <div className={styles.contactItem}>
                                <h4>Legal Business Name</h4>
                                <p className={styles.legalName}>Deegaan Energy Solutions</p>
                            </div>
                            <div className={styles.contactItem}>
                                <h4>Email</h4>
                                <p>info@e-ogaysii.com</p>
                            </div>
                            <div className={styles.contactItem}>
                                <h4>Phone</h4>
                                <p>+252615704916</p>
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
                <p>© 2026 Deegaan Energy Solutions. All rights reserved.</p>
            </footer>
        </div>
    )
}
