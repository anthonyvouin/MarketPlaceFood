'use client';

import React, { useEffect, useState, useContext } from 'react';
import { useSession } from "next-auth/react";
import { getUserById, updateUser, UserWithAdress } from "@/app/services/user/user";
import { UserDto } from "@/app/interface/user/userDto";
import { useRouter } from 'next/navigation';
import { ToastContext } from "@/app/provider/toastProvider";

const Profile = () => {
    const { data: session } = useSession();
    const [user, setUser] = useState<UserWithAdress | null>(null);
    const [loading, setLoading] = useState(false);
    const { show } = useContext(ToastContext); 
    const router = useRouter();

    useEffect(() => {
        if (session && session.user) {
            const fetchUser = async (): Promise<void> => {
                await getUserById(session.user.id)
                    .then((e: UserWithAdress | null) => setUser(e))
                    .catch(() => show("Erreur", "Erreur lors du chargement des données", "error")); 
            };
            fetchUser();
        }
    }, [session, show]);

    const handleChange = (input: 'name' | 'email', value: string): void => {
        setUser((prevUser) => {
            if (prevUser) {
                return { ...prevUser, [input]: value };
            }
            return prevUser;
        });
    };

    const submit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setLoading(true);

        if (user) {
            await updateUser(user).then((userUpdate: UserDto): void => {
                setUser((prevUser) => prevUser ? { ...prevUser, name: userUpdate.name } : prevUser);
                show("Succès", "Modifications enregistrées avec succès", "success"); 
            }).catch(() => {
                show("Erreur", "Erreur lors de l'enregistrement des données", "error"); 
            }).finally(() => {
                setLoading(false);
            });
        }
    };

    if (!session || !session.user) {
        return (
            <div className="h-screen flex items-center justify-center bg-primaryBackgroundColor">
                <div className="bg-white shadow-lg rounded-lg max-w-md mx-4 p-6">
                    <h1 className="text-2xl font-semibold text-darkActionColor mb-4">Erreur</h1>
                    <p className="text-red-600">Vous devez être connecté pour accéder à cette page.</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="w-full py-2 bg-actionColor hover:bg-darkActionColor text-white font-semibold rounded-md shadow-md transition ease-in-out duration-150 mt-4"
                    >
                        Retour à la connexion
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[85vh] flex items-center justify-center bg-primaryBackgroundColor overflow-hidden">
            <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg max-w-4xl mx-4 p-6 md:p-10 space-y-6 md:space-y-0 md:space-x-10">
                <div className="md:w-1/2 flex flex-col justify-center">
                    <h1 className="text-2xl font-semibold text-darkActionColor mb-4">Mon Profil</h1>
                    <p className="text-gray-600 mb-6">
                        Gérez vos informations de profil et assurez-vous que vos informations sont à jour.
                    </p>
                    <img src="/images/profil.svg" alt="Profile" className="w-full h-auto max-w-full"/>
                </div>

                <div className="md:w-1/2 bg-gray-50 rounded-md p-6 space-y-6">
                    {user ? (
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Prénom et Nom :</label>
                                <input 
                                    type="text"
                                    id="name"
                                    value={user.name || ''}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    required
                                    className="mt-2 px-3 py-2 w-full border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email :</label>
                                <input 
                                    type="email"
                                    id="email"
                                    value={user.email || ''}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    required
                                    disabled
                                    className="mt-2 px-3 py-2 w-full border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                                />
                            </div>

                            {user.addresses.length > 0 ? (
                                <p className="text-sm text-gray-600">Adresse par défaut :</p>
                            ) : (
                                <p className="text-sm text-gray-600">Vous n'avez pas encore configuré d'adresse par défaut</p>
                            )}
                                                         

                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full py-2 bg-actionColor hover:bg-darkActionColor text-white font-semibold rounded-md shadow-md transition ease-in-out duration-150"
                            >
                                {loading ? "Enregistrement..." : "Enregistrer les modifications"}
                            </button>

                            <button
                                type="button"
                                onClick={() => router.push('/profil/update-password')}
                                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition ease-in-out duration-150 mt-4"
                            >
                                Mettre à jour le mot de passe
                            </button>
                        </form>
                    ) : (
                        <p className="text-sm text-gray-500">Chargement des informations de l'utilisateur...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
