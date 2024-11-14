"use server"

import {PrismaClient, Product} from '@prisma/client';
import {ProductDto} from '@/app/interface/product/productDto';
import {CategoryDto} from "@/app/interface/category/categoryDto";
import {DiscountDto} from "@/app/interface/discount/discountDto";

const prisma = new PrismaClient();

// export type ProductWithCategory = Prisma.ProductGetPayload<{
//     include: { category: true };
// }>;

export async function createProduct(product: ProductDto): Promise<ProductDto> {

    if (!product.image) {
        throw new Error('Image non renseignée');
    }

    if (!product.name || !product.slug || !product.description || !product.image || product.price == null || !product.categoryId) {
        throw new Error('Tous les champs (nom, slug, description, image, prix, identifiant de catégorie) sont requis.');
    }

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
                name: product.name,
                slug: product.slug,
                description: product.description,
                image: product.image,
                price: product.price,
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
                discount: true
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
            where: {slug: slug},
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
            where: customFilters.length > 0 ? {AND: customFilters} : {},
            include: {category: true, discount: true}
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
                    ...findProduct, discountId: discount?.id
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