"use server"

import {Prisma, PrismaClient} from '@prisma/client';
import {Product} from '@/app/interface/product/product';


const prisma = new PrismaClient();


export async function createProduct(product: Product) {
    if (!product.name || !product.slug || !product.description || !product.image || product.price == null || !product.categoryId) {
        throw new Error('Tous les champs (nom, slug, description, image, prix, identifiant de catégorie) sont requis.');
    }

    try {
        const existingCategory = await prisma.category.findUnique({
            where: {id: product.categoryId},
        });

        if (!existingCategory) {
            throw new Error("La catégorie spécifiée n'existe pas.");
        }

        const formattedPrice: number = parseFloat(Number(product.price).toFixed(2));

        const newProduct: Product = await prisma.product.create({
            data: {
                name: product.name,
                slug: product.slug,
                description: product.description,
                image: product.image,
                price: new Prisma.Decimal(formattedPrice),
                categoryId: product.categoryId,
            },
        });

        return newProduct;
    } catch (error: any) {
        console.error("Erreur lors de la création du produit :", error);
        throw new Error('La création du produit a échoué.');
    }
}

export async function getProducts() {
    try {
        const products = await prisma.product.findMany();
        return products;
    } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
        throw new Error('La récupération des produits a échoué.');
    }
}

//? Le typage peut évoluer en fonction des besoins 
export async function filterProduct(filters: { [key in keyof Product]?: { 
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
}}) {
    try {
        let customFilters: any[] = []
        if (filters) {
            customFilters = Object.entries(filters)?.map(([key, value]) => ({
                [key]: value
            }));
        }

        const products = await prisma.product.findMany({
            where: customFilters.length > 0 ? { AND: customFilters } : {},
        });
        return products;
    } catch (error) {
        console.error("Erreur lors du filtrage des produits :", error);
        throw new Error('Le filtrage des produits a échoué.');
    }
}
