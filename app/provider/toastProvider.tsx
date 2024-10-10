"use client";

import React, {createContext, useState, ReactNode, useRef} from 'react';
import {Toast} from "@/app/interface/toast/toast";
import {ToastContextType} from "@/app/interface/toast/toast-context-type";

export const ToastContext = createContext<ToastContextType>({
    showToast: (): void => {
    },
});

export const ToastProvider = ({children}: { children: ReactNode }) => {
    const [toast, setToast] = useState<Toast>({
        message: '',
        type: '',
        visible: false,
    });

    const timeoutRef: React.MutableRefObject<NodeJS.Timeout | null> = useRef<NodeJS.Timeout | null>(null);

    const showToast = (message: string, type: string): void => {
        setToast({message, type, visible: true});

        timeoutRef.current = setTimeout((): void => {
            setToast({message: '', type: '', visible: false});
            timeoutRef.current = null;
        }, 3000);
    };

    const deleteMessage = (): void => {
        setToast({message: '', type: '', visible: false})
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }

    return (
        <ToastContext.Provider value={{showToast}}>
            {toast.visible && (
                <div className={`toast ${toast.type} absolute w-80 top-5 right-5 h-12 p-2.5 z-50 rounded-md shadow-lg flex justify-between`}>
                    <p>{toast.message}</p>
                    <p className="cursor-pointer font-semibold"
                       onClick={() => deleteMessage()}>x</p>
                </div>
            )}
            {children}

        </ToastContext.Provider>
    );
};