'use server';

import {Category, PrismaClient} from '@prisma/client';
import {CategoryDto} from '@/app/interface/category/categoryDto';

const prisma = new PrismaClient();

export async function createCategory(category: CategoryDto): Promise<CategoryDto> {
    if (!category.name || category.name.trim() === '') {
        throw new Error('Le nom de la catégorie est requis et doit être une chaîne de caractères non vide.');
    }

    try {
        return await prisma.category.create({
            data: {
                name: category.name,
            },
        });
    } catch (error: any) {
        if (error.code === 'P2002') {
            throw new Error('Une catégorie avec ce nom existe déjà.');
        }
        throw new Error('La création de la catégorie a échoué');
    }
}

export async function getAllCategories(): Promise<Category[]> {
    try {
        return await prisma.category.findMany({
            orderBy: {
                name: 'asc',
            },
        });
    } catch (error) {
        throw new Error('La récupération des catégories a échoué');
    }
}

export async function deleteCategoryById(id: CategoryDto['id']): Promise<{ message: string }> {
    if (!id) {
        throw new Error(`L'ID de la catégorie est requis pour la suppression.`);
    }

    try {
        await prisma.category.delete({
            where: {
                id: id,
            },
        });
        return {message: 'Catégorie supprimée avec succès.'};
    } catch (error) {
        throw new Error('La suppression de la catégorie a échoué');
    }
}

export async function updateCategory(category: CategoryDto): Promise<CategoryDto> {
    if (!category.id) {
        throw new Error(`L'ID de la catégorie est requis pour la mise à jour.`);
    }

    if (!category.name || category.name.trim() === '') {
        throw new Error('Le nouveau nom de la catégorie est requis et doit être une chaîne de caractères non vide.');
    }

    try {
        return await prisma.category.update({
            where: {
                id: category.id,
            },
            data: {
                name: category.name,
            },
        });
    } catch (error: any) {
        if (error.code === 'P2002') {
            throw new Error('Une catégorie avec ce nom existe déjà.');
        }
        throw new Error('La mise à jour de la catégorie a échoué');
    }
}

export async function getCategoriesData() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  return categories.map((category) => ({
    name: category.name,
    productCount: category._count.products,
  }));
}