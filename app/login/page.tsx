"use client"

import ButtonsProvider from "../components/auth/ButtonsProvider";
import LoginForm from "../components/auth/loginForm";
import Image from "next/image";
import RoundedButton from "@/app/components/ui/rounded-button";
import {useRouter} from "next/navigation";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {useEffect} from "react";
import {getPageName} from "@/app/utils/utils";
import {Divider} from "primereact/divider";
import Link from "next/link"; 

export default function Login() {
    const router: AppRouterInstance = useRouter();
    const goToRegister = (): void => {
        router.push("/register")
    }

    useEffect(() => {
        getPageName()
    }, []);


    return (

        <div className="height-full bg-primaryBackgroundColor pt-20">
            <div className="flex w-full pl-2.5 pr-2.5 ">
                <div className="w-3/6 flex items-center justify-center">
                    <Image src="/images/connexion.svg" alt='' className="leftDecorationImage" width="500" height="200"/>
                </div>

                <div className="w-2/5 p-2.5 bg-white flex flex-col justify-evenly rounded-md">
                    <div>
                        <h2 className="text-3xl mb-10 font-semibold">Se connecter</h2>
                        <LoginForm/>
                        <Link href="/forgot-password">
                                <p className="text-primaryColor mt-4 text-right underline text-xs cursor-pointer">Mot de passe oublié</p>
                        </Link>
                    </div>

                    <Divider align="center" className="mb-10">
                        <span className="text-sm">Ou</span>
                    </Divider>

                    <ButtonsProvider/>

                    <Divider align="center" className="mb-10">
                        <span className="text-sm">Pas encore inscrit ?</span>
                    </Divider>

                    <div className="text-center">
                        <RoundedButton onClickAction={() => goToRegister()}
                                       message={'Créer un compte'}
                                       positionIcon={"left"}
                                       classes={"border-actionColor text-actionColor"}
                        />
                    </div>

                </div>
            </div>

        </div>
    );
}