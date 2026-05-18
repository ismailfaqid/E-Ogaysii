import Link from 'next/link'
import styles from '../about/About.module.css'

export default function TermsOfServicePage() {
    return (
        <div className={styles.container}>
            <Link href="/" className={styles.backLink}>
                <span>←</span> Back to Home
            </Link>

            <main className={styles.card}>
                <h1 className={styles.title}>Terms of Service</h1>

                <div className={styles.content}>
                    <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '2rem', textAlign: 'center' }}>
                        Last Updated: May 18, 2026
                    </p>

                    <p>
                        Welcome to <strong>E-Ogaysii</strong>! By accessing or using our WhatsApp notification platform and associated services, you agree to comply with and be bound by the following Terms of Service ("Terms"). Please read these Terms carefully before using the service. E-Ogaysii is operated and managed by <strong>E-Ogaysii Technology</strong>.
                    </p>

                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '2rem 0 1rem', color: '#111827' }}>
                        1. Acceptance of Terms
                    </h2>
                    <p>
                        By creating an account, selecting clients, and initiating WhatsApp broadcasts through E-Ogaysii, you acknowledge that you have read, understood, and agreed to these Terms, our Privacy Policy, and Meta’s WhatsApp Business Terms of Service. If you do not agree, you must not use our service.
                    </p>

                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '2rem 0 1rem', color: '#111827' }}>
                        2. WhatsApp API & Compliance
                    </h2>
                    <p>
                        To send messages, you must link your own Meta Developer App and WhatsApp Business Account (WABA) or use E-Ogaysii’s approved integrations. You are strictly responsible for:
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
                        <li>Obtaining explicit opt-in consent from your clients before sending them WhatsApp broadcasts.</li>
                        <li>Ensuring all template variables and message contents comply with the WhatsApp Commerce Policy and WhatsApp Business Policy (e.g. no spam, no prohibited categories).</li>
                        <li>Covering any conversation fees charged by Meta under your linked payment method.</li>
                    </ul>

                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '2rem 0 1rem', color: '#111827' }}>
                        3. Account & Service Access
                    </h2>
                    <p>
                        You are responsible for maintaining the confidentiality of your account credentials, including your encrypted Meta API keys. E-Ogaysii Technology is not liable for any unauthorized broadcasts, data breaches, or Meta account suspensions resulting from weak credentials or violations of Meta's Developer Guidelines.
                    </p>

                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '2rem 0 1rem', color: '#111827' }}>
                        4. Limitation of Liability
                    </h2>
                    <p>
                        In no event shall E-Ogaysii Technology be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our platform, including but not limited to, Meta API outages, template rejections, or delivery blocks.
                    </p>

                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '2rem 0 1rem', color: '#111827' }}>
                        5. Changes to Terms
                    </h2>
                    <p>
                        We reserve the right to modify or replace these Terms at any time. We will notify you of major changes by updating the "Last Updated" date at the top of this page. Your continued use of the platform constitutes acceptance of the updated Terms.
                    </p>

                    <section className={styles.contactSection}>
                        <h2 className={styles.contactTitle}>Contact Support</h2>
                        <div className={styles.contactGrid}>
                            <div className={styles.contactItem}>
                                <h4>Entity</h4>
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
