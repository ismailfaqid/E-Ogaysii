'use client'

import { registerUser } from '@/actions/auth'
import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
    const router = useRouter()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError('')

        const email = formData.get('email') as string
        const password = formData.get('password') as string

        const res = await registerUser(formData)

        if (res?.success === false) {
            setError(res.message || 'An unknown error occurred')
            setLoading(false)
        } else {
            // Auto Login
            const loginRes = await signIn('credentials', {
                redirect: false,
                email,
                password
            })

            if (loginRes?.error) {
                setError('Account created, but auto-login failed. Please login manually.')
                setLoading(false)
                router.push('/login')
            } else {
                router.push('/products')
                router.refresh()
            }
        }
    }

    return (
        <div className="section container-sm" style={{ maxWidth: '400px', margin: '4rem auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>E-Ogaysii</h1>
            <p style={{ textAlign: 'center', marginBottom: '1rem', color: '#64748b' }}>
                WhatsApp Notifications Made Simple
            </p>

            <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
                <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Business Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            minLength={6}
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
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
                    Already have an account? <Link href="/login" style={{ color: 'var(--color-primary)' }}>Login here</Link>
                </p>
            </div>
        </div>
    )
}
