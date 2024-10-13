"use client";

import React, {createContext, useState, ReactNode} from 'react';
import {Dialog} from "@/app/interface/dialog/dialog";
import {DialogContextType} from "@/app/interface/dialog/dialog-context-type";
import {Button} from "@radix-ui/themes";

export const DialogContext: React.Context<DialogContextType> = createContext<DialogContextType>({
    showDialog: (): void => {
    },
});

export const DialogProvider = ({children}: { children: ReactNode }) => {
    const [dialog, setDialog] = useState<Dialog>({
        title: '',
        message: '',
        visible: false,
    });
    const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void) | null>(null);


    const showDialog = (title: string, message: string, onConfirm: () => void): void => {
        setDialog({title, message, visible: true});
        setOnConfirmCallback(() => onConfirm);
    };

    const handleValidate = (): void => {
        if (onConfirmCallback) {
            onConfirmCallback();
        }
        setDialog({...dialog, visible: false});
    };

    const handleAnnuler = (): void => {
        setDialog({...dialog, visible: false})
    }

    return (
        <DialogContext.Provider value={{showDialog}}>
            {dialog.visible && (
                <div className='absolute top-1/2 left-1/2 w-3/6 h-56 transform-translate-middle z-50 bg-white shadow-md max-w-lg'>
                    <h2 className='bg-primaryColor text-xl text-white p-2.5'>{dialog.title}</h2>
                    <p className='p-2.5 mt-5'>{dialog.message}</p>
                    <div className='absolute bottom-0 left-0 w-full '>
                        <div className='flex justify-center pb-4'>
                            <div className='mr-24'>
                                <Button color='gray' variant="outline" onClick={handleAnnuler}>Annuler</Button>
                            </div>
                            <Button color='grass' onClick={handleValidate}>Valider</Button>
                        </div>
                    </div>
                </div>
            )}
            {children}
        </DialogContext.Provider>
    );
};