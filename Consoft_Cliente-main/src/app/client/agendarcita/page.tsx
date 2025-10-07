"use client"

import { useState } from "react"
import { Calendar, TimePicker, FormField, ServiceSelector } from "@/components/agenda"
import api from "@/components/Global/axios"

export default function ScheduleSection() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState<string | null>(null)
  const [description, setDescription] = useState("")
  const [service, setService] = useState<string>("")
  const [ok, setOk] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setOk(null)
    if (!service || !date || !time) {
      setOk("Selecciona servicio, fecha y hora")
      return
    }
    try {
      const visitDate = new Date(date)
      const [hh, mm] = time.split(":")
      visitDate.setHours(Number(hh), Number(mm), 0, 0)
      await api.post("/api/visits", {
        user: undefined, // el backend asigna según autenticación si aplica
        visitDate,
        address: "Dirección por definir",
        status: "programada",
        services: [service],
      })
      setOk("Visita solicitada. Te contactaremos para confirmar.")
      setDescription("")
      setService("")
      setDate(undefined)
      setTime(null)
    } catch (e: any) {
      setOk("No se pudo crear la visita")
    }
  }

  return (
    <section className="py-10 px-4 bg-[#fff9f6]">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-1 text-gray-900">Agenda tu visita</h2>
      <p className="text-center text-gray-700 mb-6">Elige la fecha, hora y servicio que más te convenga</p>

      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-2xl p-5 md:p-8 grid grid-cols-1 gap-6 max-w-4xl mx-auto">
        {/* Selector de servicio */}
        <div>
          <h3 className="text-base font-semibold text-gray-800 mb-2">Selecciona el servicio</h3>
          <ServiceSelector value={service} onSelect={setService} />
        </div>

        {/* Calendario y horas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-2">Selecciona la fecha</h3>
            <Calendar mode="single" selected={date} onSelect={setDate} className="mx-auto" />
          </div>

          <div className="flex flex-col items-center">
            <div className="w-full">
              <h3 className="text-base font-semibold text-gray-800 mb-2">Selecciona la hora</h3>
              <TimePicker selectedTime={time} onSelect={setTime} />
            </div>

            <img src="/Agenda.png" alt="Ilustración agenda" className="max-w-[140px] mt-6 opacity-95" />
          </div>
        </div>

        {/* Descripción */}
        <div>
          <h3 className="text-base font-semibold text-gray-800 mb-2">Añade una descripción</h3>
          <FormField label="" placeholder="Añade una descripción" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        {/* Estado */}
        {ok && <p className="text-center text-sm text-[#6B4226]">{ok}</p>}

        {/* Botón */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={!service || !date || !time}
            className={`bg-[#8B5E3C] text-white px-6 py-3 rounded-lg font-medium shadow-md transition ${!service || !date || !time ? 'opacity-60 cursor-not-allowed' : 'hover:bg-[#734a2e]'}`}
          >
            Agendar
          </button>
        </div>
      </form>
    </section>
  )
}
