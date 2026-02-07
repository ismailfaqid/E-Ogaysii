"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navigation.module.css";
import { useSession, signOut } from "next-auth/react";

const Navigation = () => {
    const pathname = usePathname();
    const { data: session } = useSession();

    // Hide global navigation on landing, login, register and admin pages
    if (pathname === '/' || pathname === '/login' || pathname === '/register' || pathname.startsWith('/admin')) return null;

    const isActive = (path: string) => pathname === path;

    return (
        <nav className={styles.navbar}>
            <div className={`container ${styles.navContainer}`}>
                <div className={styles.logo}>
                    <Link href="/">E-Ogaysii</Link>
                </div>
                <div className={styles.links}>
                    {session ? (
                        <>
                            {/* @ts-ignore */}
                            {session.user?.role === 'ADMIN' && (
                                <Link
                                    href="/admin"
                                    className={`${styles.navLink} ${isActive('/admin') ? styles.active : ''}`}
                                >
                                    Admin
                                </Link>
                            )}
                            <Link
                                href="/products"
                                className={`${styles.navLink} ${isActive('/products') || isActive('/') ? styles.active : ''}`}
                            >
                                My Products
                            </Link>
                            <Link
                                href="/clients"
                                className={`${styles.navLink} ${isActive('/clients') ? styles.active : ''}`}
                            >
                                Clients
                            </Link>
                            <Link
                                href="/settings"
                                className={`${styles.navLink} ${isActive('/settings') ? styles.active : ''}`}
                            >
                                Settings
                            </Link>
                            <button
                                onClick={() => signOut({ callbackUrl: '/login' })}
                                className={styles.navLink}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit' }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className={styles.navLink}>Login</Link>
                            <Link href="/register" className={`btn btn-primary`}>Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
