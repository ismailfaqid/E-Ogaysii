'use client'

import { useSession, signOut } from "next-auth/react"
import { useState } from "react"
import { changePassword, updateEmail } from "@/actions/settings"
import { updateProfile } from "@/actions/profile"

export default function SettingsPage() {
    const { data: session, update } = useSession()

    // Profile State
    const [profileLoading, setProfileLoading] = useState(false)
    const [profileMsg, setProfileMsg] = useState('')

    // Password State
    const [passLoading, setPassLoading] = useState(false)
    const [passMsg, setPassMsg] = useState('')
    const [passError, setPassError] = useState(false)

    // Email State
    const [emailLoading, setEmailLoading] = useState(false)
    const [emailMsg, setEmailMsg] = useState('')
    const [emailError, setEmailError] = useState(false)

    async function handleProfileUpdate(formData: FormData) {
        setProfileLoading(true)
        setProfileMsg('')
        const res = await updateProfile(null, formData)
        setProfileLoading(false)
        setProfileMsg(res.message)
        if (res.success) {
            update() // Update session client-side
        }
    }

    async function handlePasswordChange(formData: FormData) {
        setPassLoading(true)
        setPassMsg('')
        const res = await changePassword(null, formData)
        setPassLoading(false)
        if (res.message) setPassMsg(res.message)
        // @ts-ignore
        setPassError(!res.success)
        if (res.success) {
            (document.getElementById('passForm') as HTMLFormElement).reset()
        }
    }

    async function handleEmailChange(formData: FormData) {
        if (!confirm('Changing your email will log you out. Continue?')) return

        setEmailLoading(true)
        setEmailMsg('')
        const res = await updateEmail(null, formData)
        setEmailLoading(false)
        if (res.success) {
            alert(res.message)
            signOut({ callbackUrl: '/login' })
        } else {
            if (res.message) setEmailMsg(res.message)
            setEmailError(true)
        }
    }

    if (!session) return <div className="section">Loading...</div>

    return (
        <div className="section container-sm">
            <h1 style={{ marginBottom: '2rem' }}>Settings</h1>

            {/* Account Info */}
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', borderRadius: 'var(--radius-lg)' }}>
                <h2>Business Profile</h2>
                <form action={handleProfileUpdate} style={{ marginTop: '1.5rem', display: 'grid', gap: '1rem' }}>

                    <div className="form-group">
                        <label className="block mb-2">{session.user?.role === 'ADMIN' ? 'App Name' : 'Business Name'}</label>
                        {/* @ts-ignore */}
                        <input
                            type="text"
                            name="name"
                            defaultValue={session.user?.role === 'ADMIN' ? 'E-Ogaysii' : (session.user?.name || '')}
                            placeholder={session.user?.role === 'ADMIN' ? 'E-Ogaysii' : 'e.g. GreenLeaf Organics'}
                            className="form-input w-full p-2 border rounded"
                            style={!session.user?.name && session.user?.role !== 'ADMIN' ? { border: '2px solid #F59E0B' } : {}}
                            required
                            readOnly={session.user?.role === 'ADMIN'}
                        />
                        {session.user?.role === 'ADMIN' ? (
                            <p style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '0.25rem' }}>The App Name is managed by the system.</p>
                        ) : !session.user?.name && (
                            <p style={{ fontSize: '0.8rem', color: '#F59E0B', marginTop: '0.25rem' }}>This name will be visible to your clients.</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="block mb-2">Profile Image</label>
                        {/* @ts-ignore */}
                        {session.user?.image && <img src={session.user.image} alt="Profile" style={{ width: '64px', height: '64px', borderRadius: '50%', marginBottom: '0.5rem', objectFit: 'cover' }} />}
                        <input type="file" name="image" accept="image/*" className="form-input w-full p-2 border rounded" />
                    </div>

                    {profileMsg && <p>{profileMsg}</p>}

                    <button type="submit" className="btn btn-primary" disabled={profileLoading}>
                        {profileLoading ? 'Saving...' : 'Save Profile'}
                    </button>

                    <hr style={{ margin: '1rem 0' }} />
                    <p style={{ marginTop: '0.5rem' }}><strong>Email:</strong> {session.user?.email}</p>
                    {/* @ts-ignore */}
                    <p><strong>Role:</strong> {session.user?.role}</p>
                </form>
            </div>

            {/* Change Password */}
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', borderRadius: 'var(--radius-lg)' }}>
                <h2>Change Password</h2>
                <form id="passForm" action={handlePasswordChange} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="block mb-2">Current Password</label>
                        <input type="password" name="current_password" required className="form-input w-full p-2 border rounded" />
                    </div>
                    <div className="form-group">
                        <label className="block mb-2">New Password</label>
                        <input type="password" name="new_password" required minLength={6} className="form-input w-full p-2 border rounded" />
                    </div>
                    <div className="form-group">
                        <label className="block mb-2">Confirm New Password</label>
                        <input type="password" name="confirm_password" required minLength={6} className="form-input w-full p-2 border rounded" />
                    </div>

                    {passMsg && <p style={{ color: passError ? 'red' : 'green' }}>{passMsg}</p>}

                    <button type="submit" className="btn btn-primary" disabled={passLoading}>
                        {passLoading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>

            {/* Update Email */}
            <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
                <h2>Update Login Email</h2>
                <p className="text-muted" style={{ marginBottom: '1rem' }}>Changing your email will require you to login again.</p>

                <form action={handleEmailChange} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="block mb-2">New Email Address</label>
                        <input type="email" name="new_email" required className="form-input w-full p-2 border rounded" />
                    </div>

                    {emailMsg && <p style={{ color: emailError ? 'red' : 'green' }}>{emailMsg}</p>}

                    <button type="submit" className="btn btn-primary" disabled={emailLoading}>
                        {emailLoading ? 'Updating...' : 'Update Email'}
                    </button>
                </form>
            </div>
        </div>
    )
}
