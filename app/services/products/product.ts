"use server"

import {PrismaClient, Product} from '@prisma/client';
import {ProductDto} from '@/app/interface/product/productDto';
import {CategoryDto} from "@/app/interface/category/categoryDto";
import {DiscountDto} from "@/app/interface/discount/discountDto";

const prisma = new PrismaClient();



export async function createProduct(product: ProductDto): Promise<ProductDto> {

    const existingName: Product | null = await prisma.product.findUnique({
        where: {name: product.name}
    })

    if (existingName) {
        throw new Error('Ce nom est déjà utilisé sur un autre produit');
    }

    const existingSlug: Product | null = await prisma.product.findUnique({
        where: {slug: product.slug}
    })

    if (existingSlug) {
        throw new Error('Ce slug est déjà attribué à un autre produit');
    }

    try {
        const existingCategory: CategoryDto | null = await prisma.category.findUnique({
            where: {id: product.categoryId},
        });

        if (!existingCategory) {
            throw new Error("La catégorie spécifiée n'existe pas.");
        }

        return await prisma.product.create({
            data: {
                name: product.name ? product.name : 'pas de nom',
                slug: product.slug ? product.slug : 'pas de slug',
                description: product.description?product.description:'pas de descriptions',
                image: product.image ? product.image : 'https://images.openfoodfacts.org/images/products/544/900/013/1805/front_en.602.400.jpg',
                price: product.price ? product.price : 500,
                categoryId: product.categoryId,
                discountId: null,
            },
        });
    } catch (error: any) {
        throw new Error('La création du produit a échoué.');
    }
}


export async function getAllProducts(): Promise<ProductDto[]> {
    try {
        return await prisma.product.findMany({
          
            orderBy: {
                name: 'asc',
            },
            include: {
                category: true,
                discount: true,
            },
        });
    } catch (error) {
        throw new Error('La récupération des produits a échoué');
    }
}

export async function getAllProductsVisible(): Promise<ProductDto[]> {
    try {
        return await prisma.product.findMany({
            where: {
                visible: true
            },

            orderBy: {
                name: 'asc',
            },
            include: {
                category: true,
                discount: true,
            },
        });
    } catch (error) {
        throw new Error('La récupération des produits a échoué');
    }
}

export async function getProductById(id: string): Promise<ProductDto | null> {
    try {
        return await prisma.product.findUnique({
            where: {id},
            include: {category: true, discount: true},
        });
    } catch (error) {
        console.error("Erreur lors de la récupération du produit :", error);
        throw new Error('La récupération du produit a échoué.');
    }
}

export async function getProductBySlug(slug: string): Promise<ProductDto | null> {
    try {
        return await prisma.product.findUnique({
            where: {slug: slug, visible: true},
            include: {category: true, discount: true},
        });
    } catch (error) {
        console.error("Erreur lors de la récupération du produit :", error);
        throw new Error('La récupération du produit a échoué.');
    }
}

export async function filterProduct(filters: {
    equals?: string | number | boolean | null;
    lte?: number;
    gte?: number;
    lt?: number;
    gt?: number;
    contains?: string;
    startsWith?: string;
    endsWith?: string;
    in?: string[] | number[];
    notIn?: string[] | number[];
}): Promise<ProductDto[]> {
    try {
        let customFilters: any[] = []
        if (filters) {
            customFilters = Object.entries(filters)?.map(([key, value]) => ({
                [key]: value
            }));
        }

        return await prisma.product.findMany({
            where: {
                AND: [
                {visible: true},
                ...(customFilters.length > 0 ?  customFilters: []),

            ],
        },
            include: {category: true, discount: true},
        });

    } catch (error) {
        console.error("Erreur lors du filtrage des produits :", error);
        throw new Error('Le filtrage des produits a échoué.');
    }
}

export async function changeDiscount(product: ProductDto | null, discount: DiscountDto | null): Promise<ProductDto> {
    if (!product) {
        throw Error('produit non définit')
    }

    const findProduct: Product | null = await prisma.product.findFirst({
        where: {
            id: product.id,
        },
    })

    if (findProduct) {
        return prisma.product.update({
                where: {
                    id: findProduct.id,
                },

                data: {
                    ...findProduct, discountId: discount ? discount.id : null
                },

                include: {
                    discount: true,
                    category: true
                },
            }
        )
    } else {
        throw Error('produit non trouvé')
    }

}

export async function toggleProductVisibility(productId: string, visible: boolean): Promise<void> {
try {

    
    const product: Product | null  = await prisma.product.findUnique({where: {id: productId}});

    if (!product) {
        throw new Error('Le produit n\'existe pas.');
    }
    await prisma.product.update({
        where: {id: productId},
        data: {visible: visible},
    });
} catch (error) {
    console.error("Erreur lors du changement de visibilité du produit :", error);
    throw new Error('Le changement de visibilité du produit a échoué.');
}
}