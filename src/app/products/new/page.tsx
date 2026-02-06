'use client'

import { createProduct } from '@/actions/products'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import styles from './NewProduct.module.css'

export default function NewProductPage() {
    const router = useRouter()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        const res = await createProduct(null, formData)
        if (res.success) {
            // Redirect to the Details screen to continue the flow
            router.push(`/products/${res.productId}`)
        } else {
            setError(res.message || 'Error creating product')
            setLoading(false)
        }
    }

    return (
        <div className="section container-sm"> {/* container-sm for centered form */}
            <header className={styles.header}>
                <Link href="/products" className={styles.backLink}>← Back</Link>
                <h1>Add New Product</h1>
            </header>

            <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
                <form action={handleSubmit} className={styles.form}>
                    {/* Section A: Product Info */}
                    <div className={styles.formGroup}>
                        <label htmlFor="product_name">Product Name</label>
                        <input type="text" name="product_name" id="product_name" required placeholder="Summer Dress" />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="price">Price</label>
                        <div className={styles.inputWrapper}>
                            <span className={styles.prefix}>$</span>
                            <input type="number" name="price" id="price" step="0.01" required placeholder="0.00" />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="description">Description</label>
                        <textarea name="description" id="description" rows={4} placeholder="Product description..."></textarea>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="imageFile">Product Image</label>
                        <input type="file" name="imageFile" id="imageFile" accept="image/*" className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
                    </div>

                    {error && <p className={styles.error}>{error}</p>}

                    {error && <p className={styles.error}>{error}</p>}

                    <div className={styles.actions}>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Saving...' : 'Save & Continue'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
