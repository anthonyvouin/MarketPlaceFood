'use client';
import {Suspense} from 'react';
import React, {useContext, useEffect, useState} from 'react';
import {useSession} from "next-auth/react";
import {AddressDto} from "@/app/interface/address/addressDto";
import {createAddress, getAdressById, updateAdress} from "@/app/services/addresses/addresses";
import {useRouter, useSearchParams} from "next/navigation";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";
import {ToastContext} from "@/app/provider/toastProvider";
import {getPageName} from "@/app/utils/utils";

type adressInput = 'address' | 'city' | 'zipCode' | 'phoneNumber' | 'additionalAddress' | 'name' | 'note'

const CreateUpdatePage = () => {
    const {data: session, status} = useSession()
    const [address, setAddress] = useState<AddressDto | null>(null);
    const router: AppRouterInstance = useRouter();
    const {show} = useContext(ToastContext);
    const searchParams = useSearchParams();
    const id: string | null = searchParams.get('id')

    useEffect((): void => {
        if (session) {
            let newAddress: AddressDto = {
                name: '',
                address: '',
                additionalAddress: '',
                zipCode: '',
                city: '',
                phoneNumber: '',
                note: '',
                isPrincipal: false,
                userId: session.user.id
            }

            if (id) {
                const fetchAdressById = async (): Promise<void> => {
                    const fetchedAddress = await getAdressById(id, session.user.id);
                    if (fetchedAddress) {
                        newAddress = fetchedAddress;
                        setAddress(newAddress);
                    } else {
                        show('Erreur', 'Adresse non trouvée', 'error');
                    }
                }
                fetchAdressById()
            }

            setAddress(newAddress)

        } else {
            router.push("/login")
        }

    }, [session]);

    useEffect((): void => {
        getPageName();
    }, []);

    const handleChange = (input: adressInput, value: string): void => {
        setAddress((prevUser) => {
            if (prevUser) {
                return {
                    ...prevUser,
                    [input]: value
                };
            }
            return prevUser;
        });
    }

    const submit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        if (address) {
            if (id) {
                updateAdress(address).then((): void => {
                    router.push(`/profil/adresses`)
                    show('Modification', 'Adresse modifiée ', 'info')
                }).catch((e) => show('Erreur', e, 'error'))

            } else {
                createAddress(address).then((): void => {
                    show('Création', 'Adresse créée ', 'info')
                    router.push(`/profil/adresses`)
                }).catch((e) => show('Erreur', e, 'error'))

            }
        }
    }

    return (
        <div className="bg-primaryBackgroundColor flex items-center min-h-screen">
            <div className="w-6/12 md:flex ml-12 hidden">
                <Image src="/images/adresses.png" width={566} height={436} alt="DriveFood"/>
            </div>

            <form onSubmit={submit}
                  className="md:w-6/12 bg-white p-5 md:mr-12">
                <div>
                    <label htmlFor="name">Nom*</label>
                    <input type="text"
                           id="name"
                           value={address ? address.name : ''}
                           onChange={(e) => handleChange('name', e.target.value)}
                           required
                           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-actionColor sm:text-sm"/>
                </div>

                <div className="mt-2.5">
                    <label htmlFor="additionnalAddress">Complément d'adresse</label>
                    <input type="text"
                           id="additionnalAddress"
                           autoComplete='fasle'
                           value={address && address.additionalAddress ? address.additionalAddress : ''}
                           onChange={(e) => handleChange('additionalAddress', e.target.value)}
                           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-actionColor sm:text-sm"/>
                </div>

                <div className="mt-2.5">
                    <label htmlFor="address">Adresse*</label>
                    <input type="text"
                           id="address"
                           autoComplete='true'
                           value={address ? address.address : ''}
                           onChange={(e) => handleChange('address', e.target.value)}
                           required
                           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-actionColor sm:text-sm"/>
                </div>

                <div className="flex flex-col md:flex-row mt-2.5">
                    <div className="mr-2.5">
                        <label htmlFor="zipCode">Code postal*</label>
                        <input type="text"
                               id="zipCode"
                               value={address ? address.zipCode : ''}
                               onChange={(e) => handleChange('zipCode', e.target.value)}
                               required
                               className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-actionColor sm:text-sm"/>
                    </div>
                    <div>
                        <label htmlFor="city">Ville*</label>
                        <input type="text"
                               id="city"
                               value={address ? address.city : ''}
                               onChange={(e) => handleChange('city', e.target.value)}
                               required
                               className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-actionColor sm:text-sm"/>
                    </div>
                </div>

                <div className="mt-2.5">
                    <label htmlFor="phoneNumber">Téléphone*</label>
                    <input type="text"
                           id="phoneNumber"
                           value={address ? address.phoneNumber : ''}
                           onChange={(e) => handleChange('phoneNumber', e.target.value)}
                           required
                           className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-actionColor sm:text-sm"/>
                </div>

                <div className="mt-2.5">
                    <label htmlFor="note">Note pour le livreur</label>
                    <textarea
                        id="note"
                        value={address && address.note ? address.note : ''}
                        onChange={(e) => handleChange('note', e.target.value)}
                        className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-actionColor sm:text-sm w-full h-32"/>
                </div>

                <button
                    type="submit"
                    className="w-full mt-5 py-2 px-4 bg-actionColor transition ease-in-out delay-150 hover:bg-darkActionColor text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    Enregistrer
                </button>
            </form>
        </div>

    );
};

const CreateUpdate = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <CreateUpdatePage/>
    </Suspense>
);

export default CreateUpdate;