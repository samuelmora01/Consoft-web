"use client"

import { useEffect, useState } from "react"
import api from "@/components/Global/axios"

export default function ServiceSelector({ value, onSelect }: { value: string; onSelect: (v: string) => void }) {
  const [services, setServices] = useState<{ _id: string; name: string }[]>([])

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/api/services")
        const list = res.data.services || res.data
        setServices(list)
      } catch {}
    }
    load()
  }, [])

  return (
    <select
      value={value}
      onChange={(e) => onSelect(e.target.value)}
      className="w-full border rounded-lg px-3 py-2"
    >
      <option value="">Elige un servicio</option>
      {services.map((s) => (
        <option key={s._id} value={s._id}>{s.name}</option>
      ))}
    </select>
  )
}