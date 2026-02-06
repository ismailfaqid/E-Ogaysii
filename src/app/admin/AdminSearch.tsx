'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState, useTransition } from 'react'
import styles from './Admin.module.css'

export default function AdminSearch() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()
    const [query, setQuery] = useState(searchParams.get('q') || '')

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setQuery(value)

        startTransition(() => {
            const params = new URLSearchParams(searchParams)
            if (value) {
                params.set('q', value)
            } else {
                params.delete('q')
            }
            router.push(`${pathname}?${params.toString()}`)
        })
    }

    return (
        <div className={styles.searchBox}>
            <span className={styles.searchIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            </span>
            <input
                type="text"
                placeholder="Search businesses by name or email"
                className={styles.searchInput}
                value={query}
                onChange={handleSearch}
            />
            {isPending && <small style={{ color: '#10B981' }}>...</small>}
        </div>
    )
}
