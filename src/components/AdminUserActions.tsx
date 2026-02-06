'use client'

import { toggleUserStatus } from "@/actions/admin_users"
import { useRouter } from "next/navigation"
import styles from "../app/admin/Admin.module.css"

export default function AdminUserActions({ userId, status }: { userId: number, status: string }) {
    const router = useRouter()

    async function handleToggle() {
        const action = status === 'Active' ? 'Suspend' : 'Activate'
        if (!confirm(`Are you sure you want to ${action} this user?`)) return
        await toggleUserStatus(userId, status)
        router.refresh()
    }

    return (
        <button
            onClick={handleToggle}
            className={styles.actionBtn}
        >
            Actions
        </button>
    )
}
