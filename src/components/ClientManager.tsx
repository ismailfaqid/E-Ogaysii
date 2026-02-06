'use client'

import { useState, useActionState, useEffect } from 'react'
import { createClient } from '@/actions/clients'
import { updateProductClients } from '@/actions/products'
import { useRouter } from 'next/navigation'
import styles from './ClientManager.module.css'

export default function ClientManager({
    initialClients,
    selectionMode = false,
    productId = null,
    initialSelected = []
}: {
    initialClients: any[],
    selectionMode?: boolean,
    productId?: number | null,
    initialSelected?: number[]
}) {
    const router = useRouter()
    const [isAdding, setIsAdding] = useState(false)
    const [selectedIds, setSelectedIds] = useState<number[]>(initialSelected)
    const [savingSelection, setSavingSelection] = useState(false)

    // Using useActionState for robust server action handling
    const [state, formAction, isPending] = useActionState(createClient, { message: '', success: false })

    useEffect(() => {
        if (state.success) {
            setIsAdding(false)
            // Use router.refresh() to get latest data from server
            router.refresh()
        }
    }, [state.success, router])

    function toggleSelection(id: number) {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(sid => sid !== id))
        } else {
            setSelectedIds([...selectedIds, id])
        }
    }

    function toggleAll() {
        if (selectedIds.length === initialClients.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(initialClients.map(c => c.id))
        }
    }

    async function saveSelection() {
        if (!productId) return
        setSavingSelection(true)
        const res = await updateProductClients(productId, selectedIds)
        if (res.success) {
            router.push(`/products/${productId}`)
        } else {
            alert('Failed to save selection')
            setSavingSelection(false)
        }
    }

    return (
        <div className={styles.container}>
            {/* Selection Toolbar */}
            {selectionMode && (
                <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 'var(--radius-md)', position: 'sticky', top: '5rem', zIndex: 40, background: 'rgba(255,255,255,0.9)' }}>
                    <div className={styles.selectionCount}>
                        <label className="flex items-center gap-2 cursor-pointer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                                type="checkbox"
                                checked={selectedIds.length === initialClients.length && initialClients.length > 0}
                                onChange={toggleAll}
                                style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--color-primary)' }}
                            />
                            <span style={{ fontWeight: 500 }}>Select All ({initialClients.length})</span>
                        </label>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => router.back()} className="btn" disabled={savingSelection}>Cancel</button>
                        <button onClick={saveSelection} className="btn btn-primary" disabled={savingSelection}>
                            {savingSelection ? 'Saving...' : `Done (${selectedIds.length})`}
                        </button>
                    </div>
                </div>
            )}

            {/* List */}
            <div className={styles.grid}>
                {initialClients.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>No clients yet. Add your first client!</p>
                    </div>
                ) : (
                    initialClients.map((client) => {
                        const isSelected = selectedIds.includes(client.id)
                        return (
                            <div
                                key={client.id}
                                className={`${styles.card}`}
                                onClick={() => selectionMode && toggleSelection(client.id)}
                                style={{
                                    cursor: selectionMode ? 'pointer' : 'default',
                                    border: isSelected ? '2px solid var(--color-primary)' : '1px solid rgba(0,0,0,0.05)',
                                    background: isSelected ? 'var(--color-primary-light)' : 'white'
                                }}
                            >
                                {selectionMode && (
                                    <div style={{ marginRight: '1rem' }}>
                                        {/* Checkbox visual - already controlled by card click mostly */}
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            readOnly
                                            style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--color-primary)' }}
                                        />
                                    </div>
                                )}
                                <div className={styles.avatar}>
                                    {client.client_name.charAt(0)}
                                </div>
                                <div className={styles.info}>
                                    <h3 className={styles.name}>{client.client_name}</h3>
                                    <p className={styles.phone}>{client.whatsapp_number}</p>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {/* Floating Add Button - Only show if NOT in selection mode? 
          User didn't specify. But usually you allow adding clients even during selection.
          I'll keep it.
      */}
            {!selectionMode && (
                <button
                    className={styles.fab}
                    onClick={() => setIsAdding(true)}
                    aria-label="Add Client"
                >
                    +
                </button>
            )}

            {/* Modal ... */}
            {isAdding && (
                <div className={styles.overlay} onClick={() => setIsAdding(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h2>Add New Client</h2>
                        <form action={formAction} className={styles.form}>
                            <div className={styles.field}>
                                <label>Name</label>
                                <input name="client_name" required placeholder="Kyle" />
                            </div>
                            <div className={styles.field}>
                                <label>WhatsApp Number</label>
                                <input name="whatsapp_number" required placeholder="+1 555 000 000" />
                            </div>
                            {state.message && <p className={state.success ? styles.success : styles.error}>{state.message}</p>}
                            <div className={styles.actions}>
                                <button type="button" onClick={() => setIsAdding(false)} className={styles.btnSecondary} disabled={isPending}>
                                    Cancel
                                </button>
                                <button type="submit" className={styles.btnPrimary} disabled={isPending}>
                                    {isPending ? 'Saving...' : 'Save Client'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
