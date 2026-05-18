import Link from 'next/link'
import styles from '../about/About.module.css'

export default function PrivacyPolicyPage() {
    return (
        <div className={styles.container}>
            <Link href="/" className={styles.backLink}>
                <span>←</span> Back to Home
            </Link>

            <main className={styles.card}>
                <h1 className={styles.title}>Privacy Policy</h1>

                <div className={styles.content}>
                    <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '2rem', textAlign: 'center' }}>
                        Last Updated: May 18, 2026
                    </p>

                    <p>
                        Welcome to <strong>E-Ogaysii</strong>. We are committed to protecting your personal data and respecting your privacy. This Privacy Policy explains how <strong>E-Ogaysii Technology</strong> ("we", "us", or "our") collects, uses, discloses, and safeguards your information when you use our WhatsApp notification platform and services.
                    </p>

                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '2rem 0 1rem', color: '#111827' }}>
                        1. Information We Collect
                    </h2>
                    <p>
                        To provide our services, we collect information that you directly provide to us, including:
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
                        <li><strong>Account Information:</strong> Your name, email address, password, and business name when you register.</li>
                        <li><strong>Client Contacts:</strong> Phone numbers and names of the clients you choose to upload or input into the system to receive WhatsApp broadcasts.</li>
                        <li><strong>WhatsApp Configuration:</strong> WhatsApp Business API credentials, access tokens, and phone number IDs that you configure in your admin settings (which are encrypted using AES-256).</li>
                    </ul>

                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '2rem 0 1rem', color: '#111827' }}>
                        2. How We Use Your Information
                    </h2>
                    <p>
                        We use the collected information for the following purposes:
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
                        <li>To provide, maintain, and improve our WhatsApp broadcasting service.</li>
                        <li>To send template messages to your selected clients on your behalf via the Meta WhatsApp Cloud API.</li>
                        <li>To secure your account and encrypt sensitive API credentials.</li>
                        <li>To maintain transaction logs and delivery status updates of your broadcasts.</li>
                    </ul>

                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '2rem 0 1rem', color: '#111827' }}>
                        3. WhatsApp API & Data Protection
                    </h2>
                    <p>
                        <strong>E-Ogaysii</strong> integrates directly with the Meta WhatsApp Cloud API. We do not store the content of your chat messages, nor do we share your client contact lists with any third parties except Meta for the sole purpose of delivering your requested broadcasts. All access tokens and phone number credentials are encrypted at rest using industry-standard AES-256 encryption keys.
                    </p>

                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '2rem 0 1rem', color: '#111827' }}>
                        4. Your Rights & Choices
                    </h2>
                    <p>
                        You can access, update, or delete your account information and saved client contacts directly within your dashboard at any time. If you wish to delete your business account and all associated WhatsApp settings permanently, please contact us at <strong>info@e-ogaysii.com</strong>.
                    </p>

                    <section className={styles.contactSection}>
                        <h2 className={styles.contactTitle}>Contact & Inquiries</h2>
                        <div className={styles.contactGrid}>
                            <div className={styles.contactItem}>
                                <h4>Legal Entity</h4>
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
