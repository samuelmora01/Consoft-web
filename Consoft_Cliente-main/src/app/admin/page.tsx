import { redirect } from 'next/navigation';

export default function AdminIndex() {
  // Redirige al listado principal del panel admin
  redirect('/admin/compras/productos');
}



