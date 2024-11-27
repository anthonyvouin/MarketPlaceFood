'use server'
import {prisma} from "@/lib/db";
import {CartDto} from "@/app/interface/cart/cartDto";
import {CartItemDto, CartItemDtoWithoutProduct} from "@/app/interface/cart/cart-item.dto";
import {ProductDto} from "@/app/interface/product/productDto";

export async function getTotalLengthItemsCart(userId: string): Promise<number> {
    const allItems: CartItemDtoWithoutProduct[] = await prisma.cartItem.findMany({
        where: {
            product: {},
            cart: {
                userId: userId,
                isConvertedToOrder: false
            },
        },
    });

    return allItems.reduce((acc: number, item: CartItemDtoWithoutProduct) => {
        if (item.quantity > 0) {
            acc += item.quantity;
        }
        return acc;
    }, 0);

}

export async function getClientCart(userId: string): Promise<CartDto | null> {
    return prisma.cart.findFirst({
        where: {
            userId,
            isConvertedToOrder: false
        },
        include: {
            cartItems: {
                include: {
                    product: {
                        include: {
                            discount: true
                        }
                    },
                    cart: false,
                },
            },
            user: true
        },

    });
}


export async function createItemCartIfUserHaveCart(product: ProductDto, clientCartId: string, quantity: number) {
    if (!product.id) {
        throw new Error(`product doesn't exist`);
    }

    let totalPriceItem: number = 0;
    if (product) {
        totalPriceItem += product.price * quantity
        totalPriceItem -= product.discount ? (totalPriceItem * product.discount.rate) / 100 : 0
    }


    return prisma.cartItem.create({
        data: {
            quantity: quantity,
            totalPrice: totalPriceItem,
            productId: product.id,
            cartId: clientCartId
        },
        include: {
            product: {
                include: {
                    discount: true
                }
            }
        }
    });
}

export async function updateItemCart(cartItem: CartItemDto, cartId: string, deleteItem: boolean = false): Promise<CartDto> {
    let itemTotalPrice: number = 0

    if (cartItem.product) {
        itemTotalPrice = cartItem.product.price * cartItem.quantity;
        itemTotalPrice -= cartItem.product.discount ? (itemTotalPrice * cartItem.product.discount.rate) / 100 : 0
    }

    if (deleteItem) {
        await prisma.cartItem.delete({
            where: {
                id: cartItem.id
            }
        })
    } else {
        await prisma.cartItem.update({
            where: {id: cartItem.id},
            data: {
                quantity: cartItem.quantity,
                totalPrice: itemTotalPrice,
            },
            include: {
                product: {
                    include: {
                        discount: true
                    }
                }
            }
        })
    }


    const allUserItemCart: CartItemDto[] = await prisma.cartItem.findMany({
        where: {
            cartId
        },
        include: {
            product: {
                include: {
                    discount: true
                }
            }
        }
    })

    const totalPrice: number = allUserItemCart.reduce((acc: number, item: CartItemDto) => {
        if (item.quantity > 0) {
            acc += item.totalPrice;
        }
        return acc;
    }, 0);

    return prisma.cart.update({
        where: {id: cartId},
        data: {
            totalPrice,
            updatedAt: new Date()
        },
        include: {
            cartItems: {
                include: {
                    product: {
                        include: {
                            discount: true
                        }
                    }
                }
            }
        }
    });
}

export async function createCart(product: ProductDto, userId: string): Promise<CartDto> {
    let itemTotalPrice: number = 0

    if (product) {
        itemTotalPrice = product.price;
        itemTotalPrice -= product.discount ? (itemTotalPrice * product.discount.rate) / 100 : 0
    }

    if (!product.id) {
        throw new Error(`product don't exist`)
    }
    return prisma.cart.create({
        data: {
            creationDate: new Date(),
            updatedAt: new Date(),
            userId,
            isConvertedToOrder: false,
            totalPrice: itemTotalPrice,
            cartItems: {
                create: [
                    {
                        quantity: 1,
                        totalPrice: itemTotalPrice,
                        productId: product.id,
                    },
                ],
            },
        },
        include: {
            cartItems: {
                include: {
                    product: {
                        include: {
                            discount: true
                        }
                    }
                }
            },
        },
    });
}

