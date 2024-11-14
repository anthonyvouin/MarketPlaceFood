import {DiscountDto} from "@/app/interface/discount/discountDto";

export const PopupAddDiscount = ({discounts, onChangeDiscount}) => {

    let selectedDiscount = null

    return (
        <div>
            <select value={undefined}
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => onChangeDiscount(e.target.value)}>
                <option value="">--choisir une remises--</option>
                {discounts.map((discount: DiscountDto) => (
                    <option key={discount.id} value={discount.id}>
                        {discount.name}
                    </option>
                ))}
            </select>
        </div>

    )
}