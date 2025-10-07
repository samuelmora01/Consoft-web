"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import ReviewCard from "@/components/servicios/ReviewCard"
import Link from "next/link"
import api from "@/components/Global/axios"

type ApiService = { _id: string; name: string; description?: string; imageUrl?: string }

export default function ServiciosPage() {
  const [services, setServices] = useState<ApiService[]>([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/api/services")
        const list: ApiService[] = res.data.services || res.data
        setServices(list)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return services
    return services.filter((s) => s.name.toLowerCase().includes(q))
  }, [services, query])

  const useCarousel = filtered.length > 4

  return (
    <section className="px-6 py-12 bg-[#fff9f6]">
      <div className="max-w-6xl mx-auto">
        {/* Header + búsqueda */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-[#4b2e1a]">Servicios</h1>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar servicio..."
            className="border rounded-lg px-3 py-2 w-full md:w-80"
          />
        </div>

        {/* Grid dinámico con carrusel si hay muchos items */}
        {loading ? (
          <p>Cargando servicios...</p>
        ) : useCarousel ? (
          <div className="overflow-x-auto">
            <div className="flex gap-6 snap-x snap-mandatory pb-4">
              {filtered.map((s) => (
                <div key={s._id} className="snap-start min-w-[250px] max-w-[280px] bg-white rounded-xl shadow-md border p-4 flex flex-col items-center text-center">
                  <img src={s.imageUrl || "/reparacion.png"} alt={s.name} className="rounded-lg mb-4 h-40 object-cover w-full" />
                  <h3 className="font-semibold text-[#4b2e1a] mb-2">{s.name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
            {filtered.map((s) => (
              <div key={s._id} className="bg-white rounded-xl shadow-md border p-4 flex flex-col items-center text-center">
                <img src={s.imageUrl || "/reparacion.png"} alt={s.name} className="rounded-lg mb-4 h-40 object-cover w-full" />
                <h3 className="font-semibold text-[#4b2e1a] mb-2">{s.name}</h3>
                <p className="text-gray-600 text-sm">{s.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* --- Sección 2: Servicio destacado (estático) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-20">
          {/* Imagen */}
          <div className="relative">
            <img
              src="/imagen2.png"
              alt="Fabricación a tu gusto"
              className="w-full h-80 object-cover rounded-xl shadow-md"
            />
            {/* Tarjeta pequeña con estrellas */}
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 flex items-center space-x-2">
              <img
                src="/mini.png"
                alt="mini"
                className="w-12 h-12 rounded-md object-cover"
              />
              <div className="flex text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Texto */}
          <div>
            <h2 className="text-3xl font-bold text-[#4b2e1a] mb-6 text-center ">Fabricación a tu gusto</h2>
            <ul className="space-y-3 text-gray-700 text-center ">
              <li>✨ Diseño 100% personalizado</li>
              <li>🪵 Selección de materiales</li>
              <li>👁️ Asesoría y visualización previa</li>
            </ul>
            <Link href="/agendarcita">
              <Button className="mt-6 bg-[#4b2e1a] hover:bg-[#3a2314] text-white px-6 py-3 rounded-full text-lg shadow-md ml-50">
                Agenda tu Cita
              </Button>
            </Link>
          </div>
        </div>

        {/* --- Sección 3: Reseñas --- */}
        <h2 className="text-2xl font-semibold text-[#4b2e1a] mt-12 mb-6 text-center">Reseñas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ReviewCard
            name="Laura G."
            location="Medellín"
            comment="El comedor que me fabricaron quedó perfecto. Pudieron ajustar las medidas y el acabado fue incluso mejor de lo que esperaba."
            rating={4}
            avatar="/laura.png"
          />
        </div>

      </div>
    </section>
  )
}
