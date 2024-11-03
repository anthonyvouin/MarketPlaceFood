"use client";

import React, {Context, createContext, MutableRefObject, ReactNode, useRef} from 'react';

import {ToastContextType} from "@/app/interface/toast/toast-context-type";
import {Toast} from 'primereact/toast';

export type typeToast = "success" | "info" | "warn" | "error" | "secondary" | "contrast" | undefined

export const ToastContext: Context<ToastContextType> = createContext<ToastContextType>({
    show: (): void => {
    },
});

export const ToastProvider = ({children}: { children: ReactNode }) => {
    const toast: MutableRefObject<Toast | null> = useRef<Toast | null>(null);

    const show = (title: string, message: string, type: typeToast): void => {

        if (toast.current) {
            toast.current.show({severity: type, summary: title, detail: message});
        }
    };

    return (
        <ToastContext.Provider value={{show}}>
            <Toast ref={toast}></Toast>
            {children}
        </ToastContext.Provider>
    );
};