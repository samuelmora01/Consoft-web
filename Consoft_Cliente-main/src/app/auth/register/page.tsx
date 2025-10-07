import { redirect } from 'next/navigation';

export default function RegisterRedirect() {
  redirect('/client/auth/register');
}


