"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import api from "@/components/Global/axios"
import { User } from "@/app/types"

type Order = {
  _id: string
  user: User
  items: { valor: number }[]
  status: string
  paymentStatus?: string
}

export default function PedidosPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/api/orders")
        setOrders(res.data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return orders
    return orders.filter((o) => o._id.toLowerCase().includes(q) || o.user?.name?.toLowerCase().includes(q))
  }, [orders, query])

  return (
    <main className="p-6 bg-[#fff9f4] min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[#8B5E3C]">Mis pedidos</h1>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por ID o cliente..."
          className="border rounded-full px-4 py-2 w-full sm:w-80"
        />
      </div>

      {loading ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-10 text-center text-[#8B5E3C] text-lg shadow-sm">
          Cargando pedidos...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-10 text-center text-[#8B5E3C] text-lg shadow-sm">
          No tienes pedidos
        </div>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-200">
          <table className="min-w-full text-sm text-center bg-white rounded-lg">
            <thead className="bg-[#8B5E3C] text-white">
              <tr>
                <th className="py-3 px-4">Pedido</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Valor</th>
                <th className="py-3 px-4">Pago</th>
                <th className="py-3 px-4">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => {
                const total = o.items.reduce((sum, it) => sum + (it.valor || 0), 0)
                return (
                  <tr key={o._id} className="border-b hover:bg-yellow-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-[#1E293B]">{o._id}</td>
                    <td className="py-3 px-4">{o.user?.name || "-"}</td>
                    <td className="py-3 px-4">{total.toLocaleString("es-CO", { style: "currency", currency: "COP" })}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${o.paymentStatus === "Pagado" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {o.paymentStatus || "Pendiente"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Link href={`/client/pedidos/${o._id}`} className="inline-block px-4 py-1 bg-[#8B5E3C] text-white rounded-full text-xs font-medium shadow hover:bg-[#5C3A21] transition-colors">
                        Ver más
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
