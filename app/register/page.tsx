'use client';

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "@/app/services/user/user";
import { UserRegisterDto } from "../interface/user/useRegisterDto";
import { ToastContext } from "@/app/provider/toastProvider";
import Image from "next/image";
import { Password } from "primereact/password"; // Importation du composant Password de PrimeReact

export default function SignUpPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const { show } = useContext(ToastContext);
    const router = useRouter();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const user: UserRegisterDto = await createUser(email, name, password);
            show("Succès", "Compte créé avec succès. Merci de valider votre mail.", "success");
            router.push("/");
        } catch (error: unknown) {
            if (error instanceof Error) {
                show("Erreur", error.message, "error");
            } else {
                show("Erreur", "Erreur inconnue lors de la création de l'utilisateur.", "error");
            }
        }
    };

    return (
        <div className="height-full bg-primaryBackgroundColor pt-20">
            <div className="flex w-full pl-2.5 pr-2.5 ">
                <div className="w-3/6 flex items-center justify-center">
                    <Image src="/images/sign-in.svg" alt='' className="leftDecorationImage" width="500" height="200"/>
                </div>
                <div className="w-2/5 p-2.5 bg-white flex flex-col justify-evenly rounded-md">
                    <h2 className="text-3xl mb-10 font-semibold">Inscription</h2>
                    <form onSubmit={handleSignUp} className="form">
                        <div>
                            <label htmlFor="name"
                                   className="block text-sm font-medium text-gray-700 mb-1">
                                Nom et Prénom
                            </label>
                            <input
                                type="text"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mt-5">
                            <label htmlFor="email"
                                   className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="mt-1 mb-6 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mt-5">
                            <label htmlFor="password"
                                   className="block text-sm font-medium text-gray-700 mb-1">
                                Mot de passe
                            </label>
                            <Password
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                                promptLabel="Créer un mot de passe"
                                weakLabel="Faible"
                                mediumLabel="Moyen"
                                strongLabel="Fort"
                                toggleMask
                                pt={{
                                  input: { className: "px-3 py-2 w-full border border-gray-300 rounded-md" }
                                }}
                            />
                        </div>

                        <button type="submit"
                                className=" mt-6 w-full py-2 px-4 bg-actionColor transition ease-in-out delay-150 hover:bg-darkActionColor text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                            Sauvegarder
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
