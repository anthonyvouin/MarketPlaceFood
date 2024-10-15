'use client';

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

const CreateUpdate = () => {
    const {data: session, status} = useSession()
    const [address, setAddress] = useState<AddressDto | null>(null);
    const router: AppRouterInstance = useRouter();
    const {showToast} = useContext(ToastContext);
    const searchParams = useSearchParams();
    const id: string | null = searchParams.get('id')

    useEffect(() => {
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
                isVisible: true,
                userId: session.user.id
            }

            if (id) {
                const fetchAdressById = async (): Promise<void> => {
                    newAddress = await getAdressById(id, session.user.id)
                    setAddress(newAddress)
                }
                fetchAdressById()
            }

            setAddress(newAddress)

        } else {
            router.push("/login")
        }

    }, [session]);

    useEffect(() => {
        getPageName();
    }, []);

    const handleChange = (input: adressInput, value: string) => {
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
                    showToast('adresse modifiée ', 'success')
                }).catch((e) => showToast(e, 'error'))

            } else {
                createAddress(address).then((): void => {
                    showToast('adresse créée ', 'success')
                    router.push(`/profil/adresses`)
                }).catch((e) => showToast(e, 'error'))

            }
        }
    }

    return (
        <div className="bg-primaryBackgroundColor height-full flex items-center">
            <div className="w-6/12 flex ml-12">
                <Image src="/images/adresses.png" width={566} height={436} alt="DriveFood"/>
            </div>

            <form onSubmit={submit}
                  className="w-6/12 bg-white p-5 mr-12">
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
                           value={address ? address.additionalAddress : ''}
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

                <div className="flex mt-2.5">
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
                        value={address ? address.note : ''}
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

export default CreateUpdate;