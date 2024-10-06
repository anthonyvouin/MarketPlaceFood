"use server"

import {Prisma, PrismaClient} from '@prisma/client';
import {ProductDto} from '@/app/interface/product/productDto';


const prisma = new PrismaClient();

export type ProductWithCategory = Prisma.ProductGetPayload<{
    include: { category: true };
}>;

export async function createProduct(product: ProductDto) {
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

        const newProduct: ProductDto = await prisma.product.create({
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
