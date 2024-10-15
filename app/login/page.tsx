"use client"

import ButtonsProvider from "../components/auth/ButtonsProvider";
import LoginForm from "../components/auth/loginForm";
import Image from "next/image";
import {Separator} from "@radix-ui/themes";
import ActionButton from "@/app/components/ui/action-button";
import {useRouter} from "next/navigation";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {useEffect} from "react";
import {getPageName} from "@/app/utils/utils";

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
                        <p className="text-primaryColor mt-4 text-right underline text-xs cursor-pointer">Mot de passe oublié</p>
                    </div>
                    <div className="relative mb-10">
                        <Separator color="indigo" size="4" className="mt-10 separator separator-ou"/>
                    </div>
                    <ButtonsProvider/>

                    <div className="relative mb-6">
                        <Separator color="indigo" size="4" className="mt-10 separator separator-not-sign-in mb-10"/>
                        <div className="text-center">
                            <ActionButton onClickAction={() => goToRegister()}
                                          message={'Créer un compte'}
                                          positionIcon={"left"}
                                          color={"grass"}
                            />
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
}