'use client';

import React, { useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getUserById, UserWithAdress } from '@/app/services/user/user';
import Link from 'next/link';
import { AddressDto } from '@/app/interface/address/addressDto';
import { deleteAdress, updateAdress } from '@/app/services/addresses/addresses';
import { getPageName } from '@/app/utils/utils';
import { Badge } from 'primereact/badge';
import { confirmDialog } from 'primereact/confirmdialog';
import { ToastContext } from '@provider/toastProvider';

const Adresses = () => {
    const { data: session, status } = useSession();
    const [user, setUser] = useState<UserWithAdress | null>(null);
    const { show } = useContext(ToastContext);

    useEffect(() => {
      if (session) {
        const fetchUser = async () => {
          const getUser: UserWithAdress | null = await getUserById(session.user.id);
          if (getUser) {
            setUser(getUser);
          }
        };
        fetchUser();
      }
    }, [session]);

    useEffect(() => {
      getPageName();
    }, []);

    const handleDelete = async (address: AddressDto) => {
      if (address.id) {
        if (address.isPrincipal) {
          const newPrincipalAddress = user?.addresses.find((addr) => addr.id !== address.id);

          if (newPrincipalAddress) {
            try {
              await updateAdress({
                ...newPrincipalAddress,
                isPrincipal: true,
              });

              await deleteAdress(address.id, session?.user.id)
                .then(() => show(`Supression d'adresse`, 'La suppression de votre adresse à bien été effectuée', 'success'))
                .catch(() => show(`Supression d'adresse`, `Erreur lors de la suppression de votre adresse`, 'error'));

              setUser((prevUser) => {
                if (!prevUser) return prevUser;

                const updatedAddresses = prevUser.addresses.filter((addr) => addr.id !== address.id);
                const updatedUser = {
                  ...prevUser,
                  addresses: updatedAddresses.map((addr) =>
                    addr.id === newPrincipalAddress.id
                      ? { ...addr, isPrincipal: true }
                      : addr
                  ),
                };

                return updatedUser;
              });
            } catch (error) {
              console.error('Erreur lors de la mise à jour de l\'adresse principale ou de la suppression', error);
            }
          }
        } else {
          try {
            await deleteAdress(address.id, session?.user.id)
              .then(() => show(`Supression d'adresse`, 'La suppression de votre adresse à bien été effectuée', 'success'))
              .catch(() => show(`Supression d'adresse`, `Erreur lors de la suppression de votre adresse`, 'error'));

            setUser((prevUser) => {
              if (!prevUser) return prevUser;
              return {
                ...prevUser,
                addresses: prevUser.addresses.filter((addr) => addr.id !== address.id),
              };
            });
          } catch (error) {
            console.error('Erreur lors de la suppression de l\'adresse', error);
            show(`Supression d'adresse`, `Erreur lors de la suppression de votre adresse`, 'error');
          }
        }
      }
    };

    const popupDelete = (address: AddressDto): void => {
      confirmDialog({
        header: 'Confirmer la suppression',
        message: `Êtes-vous sûr de vouloir supprimer l'adresse "${address.name}"`,
        acceptLabel: 'Valider',
        rejectLabel: 'Annuler',
        rejectClassName: 'mr-2.5 p-1.5 text-redColor',
        acceptClassName: 'bg-actionColor text-white p-1.5',
        accept: () => handleDelete(address)
      });
    };
    const handleSetPrincipal = async (address: AddressDto): Promise<void> => {
      const oldPrincipalAddress = user?.addresses.find((addr) => addr.isPrincipal);

      if (oldPrincipalAddress && oldPrincipalAddress.id !== address.id) {
        try {
          await updateAdress({ ...oldPrincipalAddress, isPrincipal: false });

          await updateAdress({ ...address, isPrincipal: true });

          setUser((prevUser) => {
            if (!prevUser) return prevUser;

            const updatedAddresses = prevUser.addresses.map((addr) =>
              addr.id === oldPrincipalAddress.id
                ? { ...addr, isPrincipal: false }
                : addr.id === address.id
                  ? { ...addr, isPrincipal: true }
                  : addr
            );

            return {
              ...prevUser,
              addresses: updatedAddresses,
            };
          });
        } catch (error) {
          console.error('Erreur lors de la mise à jour de l\'adresse principale', error);
        }
      }
    };
    return (
      <div className="bg-primaryBackgroundColor min-h-screen pt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 width-85 mx-auto">
          <div className="bg-white p-2.5 rounded-lg md:w-96 h-56 ">
            <Link href="adresses/create-update">
              <div className='flex items-center justify-center flex-col h-full text-actionColor font-bold hover:border border-actionColor'>
                  <h2 className="text-lg">Ajouter une adresse</h2>
                  <span className="pi pi-plus mt-5 bold"></span>
              </div>

            </Link>
          </div>
          {user && user.addresses.length > 0 ? (
            user.addresses.map((address: AddressDto) => (
              <div key={address.id}
                   className="bg-white p-5 rounded-lg md:w-96 h-56 relative">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">{address.name}</h2>
                  {address.isPrincipal ? (<Badge value="Adresse Principale"></Badge>) : ('')}
                </div>

                <div className="flex mt-2">
                  <span className="pi pi-hone"></span>
                  <div>
                    <p>{address.additionalAddress}</p>
                    <p>{address.address}</p>
                    <p>{address.zipCode} {address.city}</p>
                  </div>

                </div>

                <div className="flex items-center">
                  <span className="pi pi-mobile"></span>
                  <p>{address.phoneNumber}</p>
                </div>

                <div className="flex items-center">
                  {address.note ? (<span className="pi pi-clipboard"></span>) : ''}
                  <p className="italic ">{address.note}</p>
                </div>

                <div className="flex flex-col md:flex-row absolute bottom-2.5 left-5 md:items-center">
                  <Link href={`/profil/adresses/create-update?id=${address.id}`} className="text-sm">Modifier</Link>
                  {!address.isPrincipal ? (
                    <div>
                      <span className="text-sm hidden md:inline-block">&ensp;| &ensp;</span>
                      <span
                        className="text-actionColor underline text-sm"
                        onClick={() => handleSetPrincipal(address)}>
                                            Définir comme adresse principale
                                        </span>
                    </div>) : ('')}
                  <span className="text-sm hidden md:inline-block">&ensp;|&ensp;</span>
                  <div className="flex items-center text-red-700">
                    <span className='mr-1 md:hidden text-sm'>Supprimer</span>
                    <span className="pi pi-trash text-sm" onClick={() => popupDelete(address)}></span>
                  </div>

                </div>
              </div>
            ))
          ) : ('')}
        </div>
      </div>
    );
  }
;

export default Adresses;
