"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AddressDto } from '@/app/interface/address/addressDto';
import { getUserById } from "@/app/services/user/user";
import { createAddress } from '@/app/services/addresses/addresses';
import { useShippingAddress } from '@/app/provider/shipping-address-provider';

export default function ShippingPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [addresses, setAddresses] = useState<AddressDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [useNewAddress, setUseNewAddress] = useState(false);
    const { shippingAddress, setShippingAddress } = useShippingAddress();
    const [newAddress, setNewAddress] = useState<AddressDto>({
        name: '',
        address: '',
        additionalAddress: '',
        zipCode: '',
        city: '',
        phoneNumber: '',
        note: '',
        isPrincipal: false,
        userId: ''
    });

    useEffect(() => {
        if (session) {
            const fetchUser = async () => {
                try {
                    const userData = await getUserById(session.user.id);
                    if (userData) {
                        setAddresses(userData.addresses);
                        if (!shippingAddress && !useNewAddress) {
                            const principalAddress = userData.addresses.find(addr => addr.isPrincipal);
                            if (principalAddress) {
                                setShippingAddress(principalAddress);
                            }
                        }
                    }
                    setLoading(false);
                } catch (error) {
                    console.error("Erreur lors du chargement des adresses:", error);
                    setLoading(false);
                }
            };
            fetchUser();
        }
    }, [session, shippingAddress, setShippingAddress, useNewAddress]);

    const handleNewAddressSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user?.id) return;

        try {
            const addressToCreate : AddressDto = {
                ...newAddress,
                userId: session.user.id
            };
            const createdAddress : AddressDto = await createAddress(addressToCreate);
            setShippingAddress(createdAddress);
            setUseNewAddress(false);
            
            const updatedUserData = await getUserById(session.user.id);
            if (updatedUserData) {
                setAddresses(updatedUserData.addresses);
            }
        } catch (error) {
            console.error("Erreur lors de la création de l'adresse:", error);
        }
    };

    const handleContinue = () => {
        if (shippingAddress) {
            router.push('/payment');
        } else if (useNewAddress) {
            const form = document.querySelector('form');
            if (form) form.requestSubmit();
        }
    };

    const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewAddress(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) {
        return (
            <div className="h-[84vh] flex items-center justify-center bg-primaryBackgroundColor">
                <p className="text-lg font-semibold text-gray-700">Chargement des adresses...</p>
            </div>
        );
    }

    return (
        <div className="h-[84vh] bg-primaryBackgroundColor flex items-center justify-center">
            <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 md:p-10">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-darkActionColor">Adresse de livraison</h1>
                    <p className="text-gray-600 mt-2">
                        Veuillez sélectionner ou ajouter une adresse de livraison
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center space-x-4 mb-4">
                        <button
                            onClick={() => setUseNewAddress(false)}
                            className={`px-4 py-2 rounded ${!useNewAddress ? 'bg-actionColor text-white' : 'bg-gray-200'}`}
                        >
                            Adresses enregistrées
                        </button>
                        <button
                            onClick={() => {
                                setUseNewAddress(true);
                                setShippingAddress(null);
                            }}
                            className={`px-4 py-2 rounded ${useNewAddress ? 'bg-actionColor text-white' : 'bg-gray-200'}`}
                        >
                            Nouvelle adresse
                        </button>
                    </div>

                    {!useNewAddress ? (
                        <div className="grid grid-cols-1 gap-4">
                            {addresses.map((address) => (
                                <div
                                    key={address.id}
                                    onClick={() => setShippingAddress(address)}
                                    className={`p-4 border rounded cursor-pointer hover:border-actionColor ${
                                        shippingAddress?.id === address.id ? 'border-actionColor bg-actionColor/10' : ''
                                    }`}
                                >
                                    <p className="font-medium">{address.name}</p>
                                    <p>{address.address}</p>
                                    {address.additionalAddress && (
                                        <p className="text-sm text-gray-600">{address.additionalAddress}</p>
                                    )}
                                    <p>{address.zipCode} {address.city}</p>
                                    <p className="text-sm text-gray-600">{address.phoneNumber}</p>
                                    {address.note && <p className="text-sm text-gray-500 mt-1">{address.note}</p>}
                                    {address.isPrincipal && (
                                        <span className="inline-block mt-2 px-2 py-1 bg-actionColor/20 text-actionColor text-sm rounded">
                                            Adresse principale
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <form onSubmit={handleNewAddressSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nom de l'adresse</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newAddress.name}
                                    onChange={handleNewAddressChange}
                                    className="mt-1 block w-full rounded border-gray-300 shadow-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Adresse</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={newAddress.address}
                                    onChange={handleNewAddressChange}
                                    className="mt-1 block w-full rounded border-gray-300 shadow-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Complément d'adresse</label>
                                <input
                                    type="text"
                                    name="additionalAddress"
                                    value={newAddress.additionalAddress || ''}
                                    onChange={handleNewAddressChange}
                                    className="mt-1 block w-full rounded border-gray-300 shadow-sm"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Code postal</label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={newAddress.zipCode}
                                        onChange={handleNewAddressChange}
                                        className="mt-1 block w-full rounded border-gray-300 shadow-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Ville</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={newAddress.city}
                                        onChange={handleNewAddressChange}
                                        className="mt-1 block w-full rounded border-gray-300 shadow-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={newAddress.phoneNumber}
                                    onChange={handleNewAddressChange}
                                    className="mt-1 block w-full rounded border-gray-300 shadow-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Note (optionnel)</label>
                                <textarea
                                    name="note"
                                    value={newAddress.note || ''}
                                    onChange={handleNewAddressChange}
                                    className="mt-1 block w-full rounded border-gray-300 shadow-sm"
                                />
                            </div>
                        </form>
                    )}
                </div>

                <div className="mt-8 flex justify-between">
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Retour au panier
                    </button>
                    
                    <button
                        onClick={handleContinue}
                        disabled={!shippingAddress && !useNewAddress}
                        className={`px-6 py-2 rounded-lg ${
                            shippingAddress || useNewAddress
                                ? 'bg-actionColor hover:bg-darkActionColor text-white'
                                : 'bg-gray-300 cursor-not-allowed text-gray-500'
                        }`}
                    >
                        Continuer vers le paiement
                    </button>
                </div>
            </div>
        </div>
    );
} 