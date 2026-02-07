'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import styles from '../page.module.css'

export default function LoginPage() {
    const router = useRouter()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError('')

        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        const res = await signIn('credentials', {
            redirect: false,
            email,
            password
        })

        if (res?.error) {
            setError('Invalid email or password')
            setLoading(false)
        } else {
            router.push('/products')
            router.refresh()
        }
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.logoIcon}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <path d="M14 14h3v3h-3v-3zm4 0h3v3h-3v-3zm4 0h3v3h-3v-3zm-4 4h3v3h-3v-3zm4 0h3v3h-3v-3zm-4-4h3v3h-3v-3z" />
                    </svg>
                </div>
                <div className={styles.title}>E-Ogaysii</div>
                <div style={{ width: '24px' }}></div> {/* Spacer */}
            </header>

            <main className={styles.content} style={{ gap: '2rem', justifyContent: 'flex-start', marginTop: '2rem' }}>
                <div className={styles.textGroup}>
                    <h2 className={styles.mainHeading} style={{ fontSize: '2rem' }}>Welcome Back</h2>
                    <p className={styles.somaliTagline} style={{ fontSize: '1.1rem' }}>Soo dhawaw mar kale</p>
                </div>

                <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '400px' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.875rem' }}>Email</label>
                            <input
                                type="email"
                                name="email"
                                required
                                style={{ width: '100%', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0', background: '#f8fafc' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.875rem' }}>Password</label>
                            <input
                                type="password"
                                name="password"
                                required
                                style={{ width: '100%', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0', background: '#f8fafc' }}
                            />
                        </div>

                        {error && <p style={{ color: '#ef4444', fontSize: '0.875rem', fontWeight: '500' }}>{error}</p>}

                        <button
                            type="submit"
                            className={styles.btnLogin}
                            disabled={loading}
                            style={{ marginTop: '1rem' }}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
                        Don&apos;t have an account? <Link href="/register" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>Register here</Link>
                    </p>
                </div>
            </main>

            <footer className={styles.footer}>
                <div className={styles.homeIndicator}></div>
            </footer>
        </div>
    )
}
