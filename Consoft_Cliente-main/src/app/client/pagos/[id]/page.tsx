"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import Swal from "sweetalert2"
import { Button } from "@/components/ui/button"
import { useParams } from "next/navigation"
import api from "@/components/Global/axios"

type Payment = { _id: string; amount: number; paidAt: string; method: string; status: string; restante?: number }

type Summary = { _id: string; total: number; paid: number; restante: number; payments: Payment[] }

export default function PagoPage() {
  const { id } = useParams()
  const [comprobante, setComprobante] = useState<string | null>(null)
  const [tipoPago, setTipoPago] = useState<"abono" | "final" | null>(null)
  const [summary, setSummary] = useState<Summary | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/api/payments/${id}`)
        setSummary(res.data)
      } catch {}
    }
    if (id) load()
  }, [id])

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const url = URL.createObjectURL(file)
      setComprobante(url)
      setShowModal(false)
    }
  }

  const confirmarPago = () => {
    if (!tipoPago) {
      Swal.fire({
        icon: "warning",
        title: "Selecciona el tipo de pago",
        text: "Debes indicar si es un abono parcial o un pago final.",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#6B4226",
        background: "#FAF4EF",
        color: "#5C3A21",
      })
      return
    }

    Swal.fire({
      icon: "success",
      title: "¡Pago enviado!",
      text: `Tu comprobante fue cargado como ${tipoPago === "abono" ? "Abono parcial" : "Pago final"}. El pago está en verificación.`,
      confirmButtonText: "Ok",
      confirmButtonColor: "#6B4226",
      background: "#FAF4EF",
      color: "#5C3A21",
    }).then(() => {
      window.location.href = "/pedidos"
    })
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#FAF4EF] p-6 relative">
      <div className="w-full max-w-6xl">
        <Link href="/client/pedidos" className="inline-flex items-center px-4 py-2 rounded-full bg-[#6B4226] text-white text-sm hover:bg-[#4e2f1b] transition">
          Atrás
        </Link>

        <h1 className="text-center text-2xl font-semibold text-[#5C3A21] my-6">Continua con el pago</h1>

        {/* Resumen del pedido */}
        {summary && (
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-[#5C3A21]">
            <div className="bg-white rounded-xl border p-4 shadow">
              <p className="text-sm">Total</p>
              <p className="text-xl font-bold">{summary.total.toLocaleString("es-CO", { style: "currency", currency: "COP" })}</p>
            </div>
            <div className="bg-white rounded-xl border p-4 shadow">
              <p className="text-sm">Pagado</p>
              <p className="text-xl font-bold">{summary.paid.toLocaleString("es-CO", { style: "currency", currency: "COP" })}</p>
            </div>
            <div className="bg-white rounded-xl border p-4 shadow">
              <p className="text-sm">Restante</p>
              <p className="text-xl font-bold">{summary.restante.toLocaleString("es-CO", { style: "currency", currency: "COP" })}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-6 items-start">
          {/* Columna QR */}
          <div className="col-span-2 grid grid-cols-2 gap-6">
            <div className="flex flex-col items-center">
              <Image src="/pagos/qrbanco.png" alt="Bancolombia" width={180} height={180} />
              <p className="mt-2 text-sm text-[#5C3A21]">Pagos a Bancolombia</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-3 inline-flex items-center px-4 py-2 rounded-full bg-[#6B4226] text-white text-sm hover:bg-[#4e2f1b] transition"
              >
                Adjuntar comprobante de pago
              </button>
            </div>

            <div className="flex flex-col items-center">
              <Image src="/pagos/qrnequi.png" alt="Nequi" width={180} height={180} />
              <p className="mt-2 text-sm text-[#5C3A21]">Pagos a Nequi</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-3 inline-flex items-center px-4 py-2 rounded-full bg-[#6B4226] text-white text-sm hover:bg-[#4e2f1b] transition"
              >
                Adjuntar comprobante de pago
              </button>
            </div>

            {/* Pagos recientes */}
            {summary && (
              <div className="col-span-2 bg-white rounded-xl border p-4 shadow">
                <p className="font-semibold mb-2 text-[#5C3A21]">Pagos recientes</p>
                <div className="space-y-2 max-h-56 overflow-auto">
                  {summary.payments?.map((p) => (
                    <div key={p._id} className="flex items-center justify-between text-sm">
                      <span>{new Date(p.paidAt).toLocaleDateString("es-CO")}</span>
                      <span>{p.method}</span>
                      <span className={`${p.status.toLowerCase() === "aprobado" ? "text-green-600" : "text-yellow-700"}`}>{p.status}</span>
                      <span>{p.amount.toLocaleString("es-CO", { style: "currency", currency: "COP" })}</span>
                      <span className="text-gray-600">Restante: {Number(p.restante ?? 0).toLocaleString("es-CO", { style: "currency", currency: "COP" })}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Columna comprobante */}
          <div className="flex flex-col items-center gap-4">
            {!comprobante ? (
              <div className="w-full h-64 flex items-center justify-center border-2 border-dashed border-[#6B4226]/40 rounded-2xl bg-white shadow">
                <label className="cursor-pointer flex flex-col items-center gap-2 text-[#6B4226]">
                  <span className="px-4 py-2 rounded-full bg-[#6B4226] text-white text-sm hover:bg-[#4e2f1b] transition">
                    Cargar imagen
                  </span>
                  <span className="text-xs text-gray-500">o arrastra aquí tu comprobante</span>
                  <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                </label>
              </div>
            ) : (
              <>
                <Image src={comprobante} alt="Comprobante" width={220} height={220} className="rounded-lg shadow" />
                <div className="flex flex-col gap-2 text-[#5C3A21] text-sm">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="tipoPago" value="abono" checked={tipoPago === "abono"} onChange={() => setTipoPago("abono")} />
                    Abono parcial
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="tipoPago" value="final" checked={tipoPago === "final"} onChange={() => setTipoPago("final")} />
                    Pago final
                  </label>
                </div>
                <Button onClick={confirmarPago} className="bg-[#6B4226] hover:bg-[#4e2f1b] rounded-full px-6 mt-2">Siguiente</Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal para adjuntar comprobante */}
      {showModal && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md text-center">
            <h3 className="font-semibold text-[#5C3A21] mb-4">Cargar imagen</h3>
            <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#6B4226] text-white text-sm hover:bg-[#4e2f1b] transition">
              Seleccionar archivo
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </label>
            <p className="mt-3 text-xs text-gray-500">o arrástrala aquí</p>
            <button onClick={() => setShowModal(false)} className="mt-5 text-sm text-[#6B4226] underline">
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
