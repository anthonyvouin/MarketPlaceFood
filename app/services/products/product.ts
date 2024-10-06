"use server"

import { PrismaClient } from '@prisma/client';
import { Product } from '@/app/interface/product/product';


const prisma = new PrismaClient();


export async function createProduct(product: Product) {
  if (!product.name || !product.slug || !product.description || !product.image || product.price == null || !product.categoryId) {
    throw new Error('Tous les champs (nom, slug, description, image, prix, identifiant de catégorie) sont requis.');
  }

  try {
    const existingCategory = await prisma.category.findUnique({
      where: { id: product.categoryId },
    });

    if (!existingCategory) {
      throw new Error("La catégorie spécifiée n'existe pas.");
    }

    const formattedPrice = parseFloat(product.price.toFixed(2));

    const newProduct: Product = await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        image: product.image,
        price:  formattedPrice,
        categoryId: product.categoryId,
      },
    });

    return newProduct;
  } catch (error: any) {
    console.error("Erreur lors de la création du produit :", error);
    throw new Error('La création du produit a échoué.');
  }
}
