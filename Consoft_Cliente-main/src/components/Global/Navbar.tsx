'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import UserMenu from '@/components/UserMenu';
import { useUser } from '@/context/userContext';

export default function Navbar() {
	const { user } = useUser();
	return (
		<nav className='flex items-center justify-between px-6 py-4 bg-white shadow-sm'>
			{/* Logo */}
			<Link
				href='/client'
				className='text-xl font-bold'>
				<span className='text-[#1E293B]'>Confort</span>{' '}
				<span className='text-[#5C3A21]'>&</span>{' '}
				<span className='text-[#1E293B]'>Estilo</span>
			</Link>

			{/* Links */}
			<div className='flex gap-6 text-[#1E293B]'>
				<Link href='/client'>Inicio</Link>
				<Link href='/client/agendarcita'>Agendar Cita</Link>
				<Link href='/client/productos'>Productos</Link>
				<Link href='/client/servicios'>Servicios</Link>
				<Link href='/client/pedidos'>Mis pedidos</Link>
			</div>

			{/* Icons */}
			<div className='flex items-center gap-4'>
				{user && (
					<ShoppingCart className='h-6 w-6 cursor-pointer text-[#1E293B] hover:text-[#5C3A21]' />
				)}
				<UserMenu />
			</div>
		</nav>
	);
}
