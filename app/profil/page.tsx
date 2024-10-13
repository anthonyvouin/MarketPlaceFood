'use client';

import React, {useEffect, useState} from 'react';
import {useSession} from "next-auth/react";
import {getUserById, updateUser, UserWithAdress} from "@/app/services/user/user";
import {UserDto} from "@/app/interface/user/userDto";

const Profile = () => {
    const {data: session, status} = useSession()
    const [user, setUser] = useState<UserWithAdress | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    useEffect(() => {
        if (session) {
            const fetchUser = async () => {
                const getUser: UserWithAdress | null = await getUserById(session.user.id);
                console.log(getUser)
                if (getUser) {
                    setUser(getUser);
                }

            }
            fetchUser();

        }
    }, [session]);

    const handleChange = (input: 'name' | 'email', value: string) => {
        setUser((prevUser) => {
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
        setLoading(true);
        setError(null);
        setSuccess(null);

        if (user) {

            await updateUser(user).then((userUpdate: UserDto): void => {
                setUser((prevUser) => {
                    if (prevUser) {
                        return {
                            ...prevUser,
                            name: userUpdate.name,
                        };
                    }
                    return prevUser;
                });
                setSuccess(`Modifications enregistrées`);


            }).catch(() => {
                setError(`Erreur lors de l'enregistrement des données`);
            })
        }
    }


    return (
        <div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            {success && <p className="mt-2 text-sm text-green-600">{success}</p>}
            <div className="flex">
                {user ? (
                    <form onSubmit={submit}>
                        <div>
                            <div>
                                <label htmlFor="name">Prénom et Nom</label>
                                <input type="text"
                                       id="name"
                                       value={user.name!}
                                       onChange={(e) => handleChange('name', e.target.value)}
                                       required
                                       className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-actionColor sm:text-sm"/>
                            </div>
                            <div>
                                <label htmlFor="email">email</label>
                                <input type="email"
                                       id="email"
                                       value={user.email!}
                                       onChange={(e) => handleChange('email', e.target.value)}
                                       required
                                       disabled
                                       className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-actionColor sm:text-sm"/>
                            </div>

                            {user.addresses.length > 0 ? (
                                <p> Adresse par defaut :</p>
                            ) : (
                                <p>Vous n'avez pas encore configuré d'adresse pas défaut</p>
                            )}


                        </div>
                        <button type="submit"> Enregistrer les modifications</button>
                    </form>
                ) : (<p></p>)}

            </div>
        </div>

    );
};

export default Profile;