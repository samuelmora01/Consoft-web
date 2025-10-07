"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Star } from "lucide-react"
import api from "@/components/Global/axios"

export default function ProductDetail() {
  const router = useRouter()
  const { id } = useParams()
  const [product, setProduct] = useState<any>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/api/products/${id}`)
        setProduct(res.data)
      } catch (e) {
        setProduct(null)
      }
    }
    if (id) load()
  }, [id])

  if (!product) {
    return (
      <div className="p-6">
        <button onClick={() => router.push("/client/productos")} className="px-4 py-2 bg-[#8B5E3C] text-white rounded-lg">Volver</button>
        <p className="mt-4">Producto no encontrado</p>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2">
        {/* Columna izquierda – texto */}
        <div className="px-6 md:px-10 py-8">
          <button
            onClick={() => router.push('/client/productos')}
            className="mb-6 inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 text-xl text-[#1E293B] hover:bg-gray-50"
            aria-label="Volver"
          >
            &lt;
          </button>
          <div className="text-sm text-gray-500 mb-3">Catalogo &gt; {product.category?.name || 'General'}</div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-[#111827] mb-4">
            {product.name}
          </h1>
          <div className="flex items-center gap-3 mb-8">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-800">
              4.8 <Star size={14} className="fill-current" />
            </span>
            <span className="px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-800">30 reseñas</span>
          </div>
          <p className="text-gray-700 leading-relaxed max-w-2xl">
            {product.description || 'Esta elegante pieza combina confort y estilo en un diseño contemporáneo ideal para cualquier espacio acogedor.'}
          </p>
        </div>

        {/* Columna derecha – imagen y miniaturas sobre fondo crema */}
        <div className="relative bg-[#FFF2E9] flex flex-col items-center justify-center p-8">
          <img
            src={product.imageUrl || '/sillaProduct.png'}
            alt={product.name}
            className="w-full max-w-2xl object-contain"
          />
          <div className="mt-10 grid grid-cols-3 gap-8">
            {[0, 1, 2].map((i) => (
              <div key={i} className="border rounded-xl p-3 bg-white shadow-sm">
                <img src={product.imageUrl || '/sillaProduct.png'} alt={product.name} className="w-28 h-28 object-contain" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
