"use server"

import {Prisma, PrismaClient, Product} from '@prisma/client';
import {ProductDto} from '@/app/interface/product/productDto';
import {CategoryDto} from "@/app/interface/category/categoryDto";


const prisma = new PrismaClient();

export type ProductWithCategory = Prisma.ProductGetPayload<{
    include: { category: true };
}>;

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

        const formattedPrice: number = parseFloat(Number(product.price).toFixed(2));

        return await prisma.product.create({
            data: {
                name: product.name,
                slug: product.slug,
                description: product.description,
                image: product.image,
                price: new Prisma.Decimal(formattedPrice),
                categoryId: product.categoryId,
            },
        });
    } catch (error: any) {
        console.error("Erreur lors de la création du produit :", error);
        throw new Error('La création du produit a échoué.');
    }
}

export async function getAllProducts(fields={}): Promise<ProductDto[]> {
    try {
        if (Object.keys(fields).length === 0) {
            fields = {
                id: true,
                name: true,
                slug: true,
                description: true,
                image: true,
                price: true,
                createdAt: true,
                updatedAt: true,
                categoryId: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        }
        const products: ProductWithCategory[] = await prisma.product.findMany({
            select: {
               ...fields
            },
            orderBy: {
                name: 'asc',
            },
        });
        return transformProductDto(products);
    } catch (error) {
        throw new Error('La récupération des produits a échoué');
    }
}

export async function getProductById(id: string): Promise<any> {
    try {
        const product = await prisma.product.findUnique({
            where: {id},
            include: {category: true},
        });
        return JSON.parse(JSON.stringify(product));
    } catch (error) {
        console.error("Erreur lors de la récupération du produit :", error);
        throw new Error('La récupération du produit a échoué.');
    }
}

export async function getProductBySlug(slug: string): Promise<any> {
    try {
        const product = await prisma.product.findUnique({
            where: {slug: slug},
            include: {category: true},
        });
        return JSON.parse(JSON.stringify(product));
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
    }) {
    try {
        let customFilters: any[] = []
        if (filters) {
            customFilters = Object.entries(filters)?.map(([key, value]) => ({
                [key]: value
            }));
        }

        const products: ProductWithCategory[] = await prisma.product.findMany({
            where: customFilters.length > 0 ? {AND: customFilters} : {},
            include: {category: true}
        });

        return transformProductDto(products);
    } catch (error) {
        console.error("Erreur lors du filtrage des produits :", error);
        throw new Error('Le filtrage des produits a échoué.');
    }
}


export async function transformProductDto(products: ProductWithCategory[]): Promise<ProductDto[]> {
    const result: ProductDto[] = []

    products.map((element: ProductWithCategory) => {
        const product: ProductDto = {
            ...element, price: element.price.toNumber()
        }
        result.push(product)
    })

    return result
}