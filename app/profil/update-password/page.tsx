"use client";
import React, {useState, useEffect, useContext} from 'react';
import {useSession} from "next-auth/react";
import {updatePassword} from '@/app/services/user/user';
import {Password} from 'primereact/password';
import {UpdatePasswordDto} from "@/app/interface/user/userPasswordDto";
import {ToastContext} from "@/app/provider/toastProvider";



const PasswordUpdatePage: React.FC = () => {
    const {show} = useContext(ToastContext);
    const {data: session} = useSession();
    const [userId, setUserId] = useState<string | null>(null);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect((): void => {
        if (session) {
            setUserId(session.user.id);
        }
    }, [session]);

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setLoading(true);

        if (newPassword !== confirmPassword) {
            show('Modification du mot de passe', 'Les mots de passe ne correspondent pas.', 'error')
            setLoading(false);
            return;
        }

        try {
            if (userId) {
                const payload: UpdatePasswordDto = {userId, oldPassword, newPassword};
                const result = await updatePassword(payload);
                if (result && result.message) {
                    show('Modification du mot de passe', 'Votre nouveau mot de passe à été modifié', 'success')
                    setOldPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                }
            }

        } catch (err: unknown) {
            if (err instanceof Error) {
                show('Modification du mot de passe', 'Erreur lors de la mise à jour du mot de passe', 'error')
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[85vh] flex items-center justify-center bg-primaryBackgroundColor overflow-hidden">
            <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg max-w-4xl mx-4 p-6 md:p-10 space-y-6 md:space-y-0 md:space-x-10">
                <div className="md:w-1/2 flex flex-col justify-center">
                    <h1 className="text-2xl font-semibold text-darkActionColor mb-4">Mise à jour du mot de passe</h1>
                    <p className="text-gray-600 mb-6">
                        Pour des raisons de sécurité, nous vous recommandons de changer régulièrement votre mot de passe.
                        Assurez-vous que votre nouveau mot de passe est sécurisé et différent de votre ancien mot de passe.
                    </p>
                    <img src="/images/reset-password.svg" alt="Mise à jour du mot de passe" className="w-full h-auto max-w-full"/>
                </div>

                <div className="md:w-1/2 bg-gray-50 rounded-md p-6 space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">Ancien mot de passe :</label>
                            <Password
                                className="mt-2"
                                id="oldPassword"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                                toggleMask
                                feedback={false}
                                pt={{
                                    input:{className: 'px-3 py-2 w-full border border-gray-300 rounded-md'}
                                }}
                            />
                        </div>

                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">Nouveau mot de passe :</label>
                            <Password
                                id="newPassword"
                                className="mt-2"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={8}
                                promptLabel="Changer de mot de passe"
                                weakLabel="Mot de passe simple"
                                mediumLabel="Mot de passe moyen"
                                strongLabel="Mot de passe fort"
                                toggleMask
                                pt={{
                                    input:{className: 'px-3 py-2 w-full border border-gray-300 rounded-md'}
                                }}
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmer le mot de passe :</label>
                            <Password
                                id="confirmPassword"
                                className="mt-2"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={8}
                                promptLabel="Changer de mot de passe"
                                weakLabel="Mot de passe simple"
                                mediumLabel="Mot de passe moyen"
                                strongLabel="Mot de passe fort"
                                toggleMask
                                pt={{
                                    input:{className: 'px-3 py-2 w-full border border-gray-300 rounded-md'}
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 bg-actionColor hover:bg-darkActionColor text-white font-semibold rounded-md shadow-md transition ease-in-out duration-150"
                        >
                            {loading ? "Mise à jour en cours..." : "Mettre à jour"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PasswordUpdatePage;
