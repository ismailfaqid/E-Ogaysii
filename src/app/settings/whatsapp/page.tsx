'use client'

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { getWhatsAppSettings, saveWhatsAppSettings, testWhatsAppConnection } from "@/actions/whatsapp_settings"

export default function WhatsAppSettingsPage() {
    const { data: session } = useSession()
    const [settings, setSettings] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [testResult, setTestResult] = useState<any>(null)
    const [testing, setTesting] = useState(false)
    const [saveStatus, setSaveStatus] = useState<any>(null)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        async function load() {
            const data = await getWhatsAppSettings()
            setSettings(data)
            setLoading(false)
        }
        load()
    }, [])

    async function handleSave(formData: FormData) {
        setSaving(true)
        setSaveStatus(null)
        const res = await saveWhatsAppSettings(null, formData)
        setSaving(false)
        setSaveStatus(res)
    }

    async function handleTest() {
        setTesting(true)
        setTestResult(null)
        const res = await testWhatsAppConnection()
        setTesting(false)
        setTestResult(res)
    }

    if (loading) return <div className="section">Loading settings...</div>

    return (
        <div className="section animate-fade-in">
            <div className="container-sm">
                <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <a href="/settings" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', background: '#E2E8F0' }}>← Back</a>
                    <h1 style={{ margin: 0, fontSize: '1.5rem' }}>WhatsApp API Settings</h1>
                </div>

                <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
                    <p className="text-muted" style={{ marginBottom: '2rem', fontSize: '0.9rem' }}>
                        Configure your Meta WhatsApp Cloud API credentials. These are used to send product broadcasts directly to your clients.
                    </p>

                    <form action={handleSave} style={{ display: 'grid', gap: '1.25rem' }}>
                        <div className="form-group">
                            <label>Meta App ID</label>
                            <input 
                                type="text" 
                                name="meta_app_id" 
                                defaultValue={settings?.meta_app_id || ''} 
                                className="form-input" 
                                placeholder="e.g. 123456789012345"
                            />
                        </div>

                        <div className="form-group">
                            <label>Meta App Secret</label>
                            <input 
                                type="password" 
                                name="meta_app_secret" 
                                defaultValue={settings?.meta_app_secret || ''} 
                                className="form-input"
                                placeholder="Your Meta App Secret"
                            />
                        </div>

                        <div className="form-group">
                            <label>WhatsApp Phone Number ID</label>
                            <input 
                                type="text" 
                                name="whatsapp_phone_number_id" 
                                defaultValue={settings?.whatsapp_phone_number_id || ''} 
                                className="form-input"
                                placeholder="e.g. 109283746509128"
                            />
                        </div>

                        <div className="form-group">
                            <label>WhatsApp Business Account ID</label>
                            <input 
                                type="text" 
                                name="whatsapp_business_id" 
                                defaultValue={settings?.whatsapp_business_id || ''} 
                                className="form-input"
                                placeholder="e.g. 987654321098765"
                            />
                        </div>

                        <div className="form-group">
                            <label>Permanent Access Token</label>
                            <textarea 
                                name="whatsapp_access_token" 
                                defaultValue={settings?.whatsapp_access_token || ''} 
                                className="form-input"
                                style={{ minHeight: '80px', fontFamily: 'monospace', fontSize: '0.8rem' }}
                                placeholder="EAAG..."
                            />
                        </div>

                        <div className="form-group">
                            <label>Webhook Verify Token</label>
                            <input 
                                type="text" 
                                name="whatsapp_verify_token" 
                                defaultValue={settings?.whatsapp_verify_token || ''} 
                                className="form-input"
                                placeholder="Create a unique string for webhooks"
                            />
                        </div>

                        {saveStatus && (
                            <div className={`alert ${saveStatus.success ? 'alert-success' : 'alert-error'}`}>
                                {saveStatus.message}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="submit" className="btn btn-primary" disabled={saving}>
                                {saving ? 'Saving...' : 'Save Configuration'}
                            </button>
                            <button 
                                type="button" 
                                onClick={handleTest} 
                                className="btn btn-secondary"
                                style={{ background: '#E2E8F0' }}
                                disabled={testing || saving}
                            >
                                {testing ? 'Testing...' : 'Test Connection'}
                            </button>
                        </div>

                        {testResult && (
                            <div className={`alert ${testResult.success ? 'alert-success' : 'alert-error'}`} style={{ marginTop: '0.5rem' }}>
                                <strong>{testResult.success ? 'Success!' : 'Failed:'}</strong> {testResult.message}
                                {testResult.success && testResult.data && (
                                    <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.8 }}>
                                        Verified Phone ID: {testResult.data.id}
                                    </div>
                                )}
                            </div>
                        )}
                    </form>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', marginTop: '2rem' }}>
                    <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Webhook Configuration</h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                        Use the following details in your Meta Developer Portal:
                    </p>
                    <div style={{ background: '#f1f5f9', padding: '1rem', borderRadius: 'var(--radius-md)', marginTop: '1rem', fontSize: '0.8rem' }}>
                        <p><strong>Callback URL:</strong> <code>{window.location.origin}/api/webhooks/whatsapp</code></p>
                        <p style={{ marginTop: '0.5rem' }}><strong>Verify Token:</strong> <code>{settings?.whatsapp_verify_token || '(save settings first)'}</code></p>
                    </div>
                </div>
            </div>
        </div>
    )
}
