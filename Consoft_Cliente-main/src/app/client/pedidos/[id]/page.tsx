"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import api from "@/components/Global/axios"

export default function PedidoDetallePage() {
  const { id } = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/api/orders/${id}`)
        setOrder(res.data)
      } finally {
        setLoading(false)
      }
    }
    if (id) load()
  }, [id])

  // Hooks deben ejecutarse siempre antes de cualquier return condicional.
  const total = useMemo(() => {
    if (!order) return 0
    if (typeof order.total === 'number') return order.total
    return order.items?.reduce((s: number, it: any) => s + (it.valor || 0), 0) ?? 0
  }, [order])
  const pretty = (n: number) => Number(n).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })

  if (loading) return <p className="p-6">Cargando pedido...</p>
  if (!order) return <p className="p-6">No existe el pedido</p>

  const handleAction = () => router.push(`/client/pagos/${order._id}`)

  return (
    <main className="min-h-screen bg-[#FFF6EF]">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.push('/client/pedidos')} className="inline-flex items-center px-4 py-2 rounded-full bg-[#6B4226] text-white text-sm hover:bg-[#4e2f1b] transition">Atrás</button>
        </div>

        <h1 className="text-center text-4xl font-extrabold text-[#5C3A21] mb-8">Productos</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {order.items?.map((it: any, idx: number) => (
            <div key={idx} className="bg-white rounded-2xl shadow p-4 text-center">
              <div className="h-44 w-full rounded-xl bg-[#F7EFE9] flex items-center justify-center overflow-hidden">
                {it.id_servicio?.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={it.id_servicio.imageUrl} alt={it.id_servicio.name} className="h-full object-cover" />
                ) : (
                  <div className="text-sm text-gray-500">{it.detalles || 'Servicio'}</div>
                )}
              </div>
              <p className="mt-3 font-semibold text-[#1E293B]">{it.id_servicio?.name || 'Servicio'}</p>
              <p className="text-sm text-gray-600">{pretty(it.valor || 0)}</p>
            </div>
          ))}
        </div>

        <hr className="border-[#E7D6C8] my-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-xl font-semibold text-[#5C3A21] mb-4">Detalles</h2>
            <div className="space-y-3 text-[#1E293B]">
              <div className="flex gap-2"><span className="font-semibold">Fecha de inicio:</span> <span>{order.startedAt ? new Date(order.startedAt).toLocaleDateString('es-CO') : '-'}</span></div>
              <div className="flex gap-2"><span className="font-semibold">Fecha de entrega:</span> <span>{order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString('es-CO') : '-'}</span></div>
              <div className="flex gap-2"><span className="font-semibold">Precio acordado:</span> <span>{pretty(total)}</span></div>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#5C3A21] mb-4">Estado</h2>
            <div className="text-2xl font-semibold text-[#1E293B]">{order.status}</div>
          </div>
        </div>

        <div className="mt-10 flex justify-end">
          <button onClick={handleAction} className="px-6 py-2 bg-[#8B5E3C] text-white rounded-full shadow hover:bg-[#5C3A21] transition-colors">Siguiente</button>
        </div>
      </div>
    </main>
  )
}
