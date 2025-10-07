"use client"

import { useEffect, useState, useMemo } from "react"
import ProductCard from "@/components/productos/ProductCard"
import SidebarFilters from "@/components/productos/SideBarFiltrer"
import api from "@/components/Global/axios"

type ApiProduct = {
  _id: string
  name: string
  description?: string
  imageUrl?: string
  category?: { _id: string; name: string }
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState("")

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await api.get("/api/products")
        const list: ApiProduct[] = res.data.products || res.data // soporta ambos formatos
        setProducts(list)
      } catch (e: any) {
        setError(e?.message ?? "Error cargando productos")
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return products
    return products.filter((p) => p.name.toLowerCase().includes(q))
  }, [products, query])

  return (
    <section className="bg-[#f9f9f9] min-h-screen py-10 px-6">
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8 max-w-7xl mx-auto">
        {/* Sidebar */}
        <SidebarFilters />

        {/* Grid de productos */}
        <div className="flex-1">
          <div className="flex justify-end mb-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar producto..."
              className="border rounded-lg px-3 py-2 w-full md:w-80"
            />
          </div>
          {loading && <p>Cargando productos...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <ProductCard
                  key={p._id}
                  id={p._id}
                  name={p.name}
                  price={""}
                  image={p.imageUrl || "/sillaProduct.png"}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
