import ClientManager from '@/components/ClientManager'
import { getClients } from '@/actions/clients'
import { getProduct } from '@/actions/products'

export default async function ClientsPage({ searchParams }: { searchParams: Promise<{ select_for?: string }> }) {
    const clients = await getClients()
    const resolvedParams = await searchParams
    const productId = resolvedParams.select_for ? Number(resolvedParams.select_for) : null

    let initialSelected: number[] = []
    let product = null

    if (productId) {
        product = await getProduct(productId)
        if (product && product.selected_clients) {
            initialSelected = product.selected_clients.map((c: any) => c.id)
        }
    }

    return (
        <div className="section">
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                    {productId ? `Select Clients for "${product?.product_name}"` : 'Clients'}
                </h1>
                <p style={{ color: 'var(--color-text-muted)' }}>
                    {productId ? 'Who should receive this broadcast?' : 'Manage your WhatsApp audience'}
                </p>
            </header>
            <ClientManager
                initialClients={clients}
                selectionMode={!!productId}
                productId={productId}
                initialSelected={initialSelected}
            />
        </div>
    )
}
