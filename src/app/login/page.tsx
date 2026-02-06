'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
        <div className="section container-sm" style={{ maxWidth: '400px', margin: '4rem auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>E-Ogaysii</h1>
            <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#64748b' }}>
                Ku Ogaysii Macaamiishaada WhatsApp
            </p>

            <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="form-input"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="form-input"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1' }}
                        />
                    </div>

                    {error && <p style={{ color: 'red', fontSize: '0.875rem' }}>{error}</p>}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ marginTop: '1rem' }}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
                    Don't have an account? <Link href="/register" style={{ color: 'var(--color-primary)' }}>Register here</Link>
                </p>
            </div>
        </div>
    )
}
