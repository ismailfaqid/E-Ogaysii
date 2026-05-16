'use client'

import { useState, useEffect } from "react"
import { getTemplates, saveTemplate, deleteTemplate } from "@/actions/templates"

export default function TemplatesPage() {
    const [templates, setTemplates] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showAdd, setShowAdd] = useState(false)
    const [saveMsg, setSaveMsg] = useState<any>(null)

    useEffect(() => {
        loadTemplates()
    }, [])

    async function loadTemplates() {
        const data = await getTemplates()
        setTemplates(data)
        setLoading(false)
    }

    async function handleAdd(formData: FormData) {
        const res = await saveTemplate(null, formData)
        setSaveMsg(res)
        if (res.success) {
            setShowAdd(false)
            loadTemplates()
        }
    }

    async function handleDelete(id: number) {
        if (!confirm('Are you sure you want to delete this template reference?')) return
        const res = await deleteTemplate(id)
        if (res.success) {
            loadTemplates()
        }
    }

    if (loading) return <div className="section">Loading templates...</div>

    return (
        <div className="section animate-fade-in">
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1>WhatsApp Templates</h1>
                    <button onClick={() => setShowAdd(!showAdd)} className="btn btn-primary">
                        {showAdd ? 'Cancel' : '+ Add Approved Template'}
                    </button>
                </div>

                {showAdd && (
                    <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }}>
                        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Register Approved Meta Template</h2>
                        <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                            Only enter template names that have been <strong>approved</strong> in your Meta Developer Portal.
                        </p>
                        <form action={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
                            <div className="form-group" style={{ margin: 0 }}>
                                <label>Template Name</label>
                                <input type="text" name="name" className="form-input" placeholder="e.g. product_alert" required />
                            </div>
                             <div className="form-group" style={{ margin: 0 }}>
                                <label>Language</label>
                                <select name="language" className="form-input">
                                    <option value="en">English (en)</option>
                                    <option value="so">Somali (so)</option>
                                    <option value="en_US">English (US) (en_US)</option>
                                    <option value="en_GB">English (UK) (en_GB)</option>
                                    <option value="so_SO">Somali (Somalia) (so_SO)</option>
                                    <option value="ar">Arabic (ar)</option>
                                </select>
                            </div>
                            <div className="form-group" style={{ margin: 0 }}>
                                <label>Category</label>
                                <select name="category" className="form-input">
                                    <option value="MARKETING">Marketing</option>
                                    <option value="UTILITY">Utility</option>
                                    <option value="AUTHENTICATION">Authentication</option>
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary">Add</button>
                        </form>
                        {saveMsg && <p style={{ marginTop: '1rem', color: saveMsg.success ? 'green' : 'red' }}>{saveMsg.message}</p>}
                    </div>
                )}

                <div className="grid-layout">
                    {templates.length === 0 ? (
                        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', gridColumn: '1 / -1' }}>
                            <p className="text-muted">No templates registered yet.</p>
                        </div>
                    ) : (
                        templates.map((t: any) => (
                            <div key={t.id} className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{t.name}</h3>
                                    <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                                        {t.category} • {t.language}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => handleDelete(t.id)} className="btn btn-secondary" style={{ color: 'red', background: '#FEF2F2' }}>Delete</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="glass-panel" style={{ marginTop: '3rem', padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--color-primary-light)', border: '1px solid var(--color-primary)' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-primary-dark)' }}>💡 Pro Tip: Dynamic Variables</h3>
                    <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: 'var(--color-primary-dark)', opacity: 0.8 }}>
                        The system automatically maps <strong>Business Name</strong>, <strong>Product Name</strong>, and <strong>Price</strong> to your template variables in that order.
                    </p>
                </div>
            </div>
        </div>
    )
}
