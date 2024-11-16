'use client'
import {DiscountDto} from "@/app/interface/discount/discountDto";
import {useState} from "react";

export const PopupAddDiscount = ({discounts, onChangeDiscount, selectedDiscount}) => {
    const [discount, setDiscount] = useState<string>(selectedDiscount);
    console.log('discount',discount)
    console.log('selected discount',selectedDiscount)

    return (
        <div>
            <select value={discount}
                    className="w-full border border-actionColor p-2.5"
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
                        onChangeDiscount(e.target.value)
                        setDiscount(e.target.value)
                    }
                    }>
                {discounts.map((discount: DiscountDto) => (
                    <option key={discount.id} value={discount.id}>
                        {discount.name}
                    </option>
                ))}
                <option value="">Aucune</option>
            </select>
        </div>

    )
}