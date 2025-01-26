'use server';

import {Category, PrismaClient} from '@prisma/client';
import {CategoryDto} from '@/app/interface/category/categoryDto';
import { verifyAuth } from '@/app/core/verifyAuth';

const prisma = new PrismaClient();

export async function createCategory(category: CategoryDto): Promise<CategoryDto> {
    await verifyAuth(['ADMIN']);
    if (!category.name || category.name.trim() === '') {
        throw new Error('Le nom de la catégorie est requis et doit être une chaîne de caractères non vide.');
    }

    try {
        return await prisma.category.create({
            data: {
                name: category.name,
                visible: true,
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
    // no middleWare because all people can have access to allCategories
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
    await verifyAuth(['ADMIN']);
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
    await verifyAuth(['ADMIN']);
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
                visible: category.visible
            },
        });
    } catch (error: any) {
        if (error.code === 'P2002') {
            throw new Error('Une catégorie avec ce nom existe déjà.');
        }
        throw new Error('La mise à jour de la catégorie a échoué');
    }
}
