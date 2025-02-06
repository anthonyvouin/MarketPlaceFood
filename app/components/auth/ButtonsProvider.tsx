'use client';
import Image from 'next/image';
import { signIn, useSession } from 'next-auth/react';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContext } from '@provider/toastProvider';

export default function ButtonsProvider() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { show } = useContext(ToastContext);
  useEffect(() => {
    if (status === 'authenticated') {
      const role = session.user['role'];

      if (role === 'ADMIN') {
        show('Connexion Réussi', 'Vous allez être redirigé sur la page admin', 'success');
        router.push('/admin');
      } else if (role === 'STOREKEEPER') {
        show('Connexion Réussi', 'Vous allez être redirigé sur la page admin/produit', 'success');
        router.push('/admin/product');
      } else if (role === 'USER') {
        show('Connexion Réussi', `Vous allez être redirigé sur la page d'accueil`, 'success');
        router.push('/');
      }
    }
  }, [status]);

  return (
    <div className="flex justify-center">
      <button className="google-button flex items-center justify-center"
              onClick={() => signIn('google')} type="button">
        <Image src="/images/googleLogo.png" width={40} height={40} alt="logo google"/>
      </button>
    </div>
  );
}