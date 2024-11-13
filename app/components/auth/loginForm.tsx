'use client';

import {useState} from "react";
import {useRouter} from "next/navigation";
import {signIn} from "next-auth/react";
import {UserLoginDto} from "@/app/interface/user/userLoginDto";


export default function SignInPage() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const router = useRouter();

    const handleSignIn = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        const userLoginData: UserLoginDto = {
            email: email,
            password: password,
        };

        try {
            const result = await signIn("credentials", {
                email: userLoginData.email,
                password: userLoginData.password,
                redirect: false,
            });

            if (result?.error) {
                console.error("Erreur lors de la connexion :", result.error);
                if (result.error === "Veuillez vérifier votre email pour vous connecter.") {
                    router.push("/resend-email");
                }
            } else {
                router.push("/profil");
            }
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
        }
    };

    return (
        <form onSubmit={handleSignIn} className="form w-full ">

            <div>
                <label htmlFor="email"
                       className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div className="mt-5">
                <label htmlFor="password"
                       className="block text-sm font-medium text-gray-700 mt-1">
                    Mot de passe
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    className="mt-1 mb-6 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

            </div>


            <button type="submit"
                    className="w-full py-2 px-4 bg-actionColor transition ease-in-out delay-150 hover:bg-darkActionColor text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                Se connecter
            </button>
        </form>
    );
}
