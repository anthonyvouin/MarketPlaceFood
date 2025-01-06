"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AddressDto } from '@/app/interface/address/addressDto';

interface ShippingAddressContextType {
    shippingAddress: AddressDto | null;
    setShippingAddress: (address: AddressDto | null) => void;
    clearShippingAddress: () => void;
}

const ShippingAddressContext = createContext<ShippingAddressContextType | undefined>(undefined);

export function ShippingAddressProvider({ children }: { children: ReactNode }) {
    const [shippingAddress, setShippingAddress] = useState<AddressDto | null>(null);

    const clearShippingAddress = () => {
        setShippingAddress(null);
    };

    return (
        <ShippingAddressContext.Provider 
            value={{ 
                shippingAddress, 
                setShippingAddress, 
                clearShippingAddress 
            }}
        >
            {children}
        </ShippingAddressContext.Provider>
    );
}

export function useShippingAddress() {
    const context = useContext(ShippingAddressContext);
    if (context === undefined) {
        throw new Error('useShippingAddress doit être utilisé dans un ShippingAddressProvider');
    }
    return context;
} 