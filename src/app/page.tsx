import Link from "next/link";
import styles from "./page.module.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/products");
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logoIcon}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <path d="M14 14h3v3h-3v-3zm4 0h3v3h-3v-3zm0 4h3v3h-3v-3zm-4 4h3v3h-3v-3zm4 0h3v3h-3v-3zm-4-4h3v3h-3v-3z" />
          </svg>
        </div>
        <div className={styles.title}>E-Ogaysii</div>
        <div className={styles.globeIcon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.content}>
        {/* Icon Stack */}
        <div className={styles.iconStack}>
          <div className={styles.mainIconBox}>
            <svg width="55" height="55" viewBox="0 0 24 24" fill="white">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 6h2v2h-2V7zm0 4h2v6h-2v-6z" />
              {/* Simplified megaphone/shield combo for that premium look */}
            </svg>
            {/* Replacement SVG to match megaphone more closely */}
            <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor" style={{ position: 'absolute' }}>
              <path d="M14 3.23v2.06c2.81.91 4.81 3.49 4.81 6.51 0 3.02-2 5.6-4.81 6.51v2.06c3.95-.97 6.81-4.47 6.81-8.57 0-4.1-2.86-7.6-6.81-8.57zM11 2L4 7v10l7 5V2z"></path>
            </svg>
          </div>
          <div className={styles.subIconBox}>
            <svg width="42" height="42" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2z" />
            </svg>
          </div>
        </div>

        {/* Typography */}
        <div className={styles.textGroup}>
          <h2 className={styles.mainHeading}>
            WhatsApp<br />
            Notifications Made<br />
            Simple
          </h2>
          <p className={styles.somaliTagline}>
            Ku Ogaysii Macaamiishaada<br />
            WhatsApp
          </p>
          <div className={styles.helperText}>
            <span className={styles.businessOnly}>FOR BUSINESSES ONLY</span>
            <p className={styles.description}>
              Notify your clients instantly via WhatsApp
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Link href="/login" className={styles.btnLogin}>
            Login
          </Link>
          <Link href="/register" className={styles.btnRegister}>
            Register
          </Link>
        </div>
      </main>

      {/* About Section */}
      <section className={styles.aboutSection}>
        <h2 className={styles.aboutTitle}>About the Company</h2>
        <div className={styles.aboutContent}>
          <p>
            <strong className={styles.legalName}>Deegaan Energy Solutions</strong> is a legally registered company providing electrical installation, solar energy systems, maintenance services, and supply of electrical and renewable energy equipment.
          </p>
          <p>
            The company also delivers digital services including marketing solutions, WhatsApp customer notification systems, and web and software development for small and medium businesses.
          </p>
          <p>
            E-Ogaysii is a product operated and managed by <strong className={styles.legalName}>Deegaan Energy Solutions</strong>.
          </p>

          <div className={styles.contactBlock}>
            <h3 className={styles.contactTitle}>Contact Information</h3>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>Business:</span>
              <span className={styles.legalName}>Deegaan Energy Solutions</span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>Email:</span>
              <span>info@e-ogaysii.com</span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>Phone:</span>
              <span>+252615704916</span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>Address:</span>
              <span>Kismayo, Somalia</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <Link href="/about" style={{ textDecoration: 'none', color: 'inherit' }}>About</Link>
          <div className={styles.dotSeparator}></div>
          <span>Privacy Policy</span>
          <div className={styles.dotSeparator}></div>
          <span>Terms of Service</span>
        </div>
        <p className={styles.footerNote}>
          © 2026 Deegaan Energy Solutions. All rights reserved.
        </p>
        <div className={styles.homeIndicator}></div>
      </footer>
    </div>
  );
}
