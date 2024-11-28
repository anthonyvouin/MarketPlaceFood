export const formatPriceEuro = (price: number): string => {
    return (price / 100).toFixed(2)
}

export const calculAndformatPriceWithDiscount = (price: number, discount: number, quantity: number = 1): string => {
    const priceOneProduct: number = price - (price * discount / 100)
    const roundedPriceOneProduct: number = Math.floor(priceOneProduct * 100) / 100;
    //----don't touch Matthias, it's for final ecarts--
    const priceString: string = formatPriceEuro(roundedPriceOneProduct)
    const total: number = Number(priceString) * quantity
    return total.toFixed(2)
    //-------------------fin--------------------------
}