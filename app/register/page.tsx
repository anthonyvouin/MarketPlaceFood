'use client';

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {createUser} from "@/app/services/user/user";
import {signIn} from "next-auth/react";
import {UserRegisterDto} from "../interface/user/useRegisterDto";
import {getPageName} from "@/app/utils/utils";
import Image from "next/image";

export default function SignUpPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const router = useRouter();

    useEffect(() => {
        getPageName();
    }, []);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const user: UserRegisterDto = await createUser(email, name, password);
            const result = await signIn("credentials", {
                email: user.email,
                password: password,
                redirect: false,
            });

            if (result?.error) {
                console.error("Erreur lors de la connexion :", result.error);
            } else {
                router.push("/");
            }
        } catch (error) {
            console.error("Erreur lors de l'inscription :", error);
        }
    };

    return (
        <div className="height-full bg-primaryBackgroundColor pt-20">
            <div className="flex w-full pl-2.5 pr-2.5 ">
                <div className="w-3/6 flex items-center justify-center">
                    <Image src="/images/sign-in.svg" alt='' className="leftDecorationImage" width="500" height="200"/>
                </div>
                <div className="w-2/5 p-2.5 bg-white flex flex-col justify-evenly rounded-md">
                    <h2 className="text-3xl mb-10 font-semibold">Incription</h2>
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
                            <input
                                type="password"
                                id="password"
                                className="mt-1 mb-6 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>


                        <button type="submit"
                                className="w-full py-2 px-4 bg-actionColor transition ease-in-out delay-150 hover:bg-darkActionColor text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                            Sauvegarder
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
