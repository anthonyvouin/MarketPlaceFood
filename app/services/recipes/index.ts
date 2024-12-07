"use server"

import { PrismaClient, Prisma, RecipeType } from '@prisma/client';

const prisma = new PrismaClient();

type CreateRecipeInput = {
    name: string;
    slug: string;
    description: string;
    image?: string;
    preparationTime: number;
    cookingTime: number;
    servings: number;
    difficulty: string;
    type: RecipeType;
    ingredients: {
        productId: string;
        quantity: number;
        unit: string;
    }[];
    steps?: {
        stepNumber: number;
        description: string;
        image?: string;
        duration?: number;
    }[];
};

type UpdateRecipeInput = Partial<Omit<CreateRecipeInput, 'userId'>>;

// Créer une recette
export async function createRecipe(data: CreateRecipeInput, userId: string): Promise<any | null> {
    try {
        const { ingredients, steps, ...recipeData } = data;
        switch (data.type) {
            case "BEVERAGE":
                recipeData.type = RecipeType.BEVERAGE;
                break;
            case "BREAKFAST":
                recipeData.type = RecipeType.BREAKFAST;
                break;
            case "DESSERT":
                recipeData.type = RecipeType.DESSERT;
                break;
            case "MAIN_DISH":
                recipeData.type = RecipeType.MAIN_DISH;
                break;
            case "SIDE_DISH":
                recipeData.type = RecipeType.SIDE_DISH;
                break;
            case "SNACK":
                recipeData.type = RecipeType.SNACK;
                break;
            case "STARTER":
                recipeData.type = RecipeType.STARTER;
                break;
            default:
                recipeData.type = RecipeType.MAIN_DISH;
                break;
        }

        const recipe = await prisma.recipe.create({
            data: {
                ...recipeData,
                createdBy: {
                    connect: { id: userId }
                },
                recipeIngredients: {
                    create: ingredients.map(ing => ({
                        quantity: new Prisma.Decimal(ing.quantity),
                        unit: ing.unit,
                        product: {
                            connect: { id: ing.productId }
                        }
                    }))
                },
                steps: steps ? {
                    create: steps.map(step => ({
                        stepNumber: step.stepNumber,
                        description: step.description,
                        image: step.image,
                        duration: step.duration
                    }))
                } : undefined
            },
            include: {
                recipeIngredients: {
                    include: {
                        product: true
                    }
                },
                steps: true,
                createdBy: true
            }
        });

        return JSON.parse(JSON.stringify(recipe));
    } catch (error) {
        console.log(error);
        if (error.code === 'P2002') {
            console.log("Recipe already exists, skipping:", data.name);
            return null; // Retourne null pour ne pas interrompre le processus, parce qu'on veut continuer à créer les autres recettes
        }
        if (error.code === 'P2025') {
            console.log("One of the product of the recipes not found, skipping:", JSON.stringify(data.ingredients));
            return null; // Retourne null pour ne pas interrompre le processus, parce qu'on veut continuer à créer les autres recettes
        }
        console.error("Erreur lors de la création de la recette:", error);
        throw new Error('La création de la recette a échoué.');
    }
}

// Récupérer une recette par ID
export async function getRecipeBySlug(slug: string): Promise<any> {
    try {
        const recipe = await prisma.recipe.findUnique({
            where: { slug: slug },
            include: {
                recipeIngredients: {
                    include: {
                        product: true
                    }
                },
                steps: {
                    orderBy: {
                        stepNumber: 'asc'
                    }
                },
            }
        });

        return JSON.parse(JSON.stringify(recipe));
    } catch (error) {
        console.error("Erreur lors de la récupération de la recette :", error);
        throw new Error('La récupération de la recette a échoué.');
    }
}

export async function getRecipeById(id: string): Promise<any> {
    try {
        const recipe = await prisma.recipe.findUnique({
            where: { id },
            include: {
                recipeIngredients: {
                    include: {
                        product: true
                    }
                },
                steps: {
                    orderBy: {
                        stepNumber: 'asc'
                    }
                },
            }
        });

        return JSON.parse(JSON.stringify(recipe));
    } catch (error) {
        console.error("Erreur lors de la récupération de la recette :", error);
        throw new Error('La récupération de la recette a échoué.');
    }
}

export async function getRandomRecipes(limit): Promise<any> {
    try {
        const recipes = await prisma.recipe.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                recipeIngredients: {
                    include: {
                        product: true
                    }
                },
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            }
        });

        recipes.sort(() => Math.random() - 0.5);
        recipes.length = Math.min(limit, recipes.length);

        return JSON.parse(JSON.stringify(recipes));
    } catch (error) {
        console.error("Erreur lors de la récupération des recettes aléatoires :", error);
        throw new Error('La récupération des recettes aléatoires a échoué.');
    }
}

// Récupérer toutes les recettes
export async function getAllRecipes(page = 1, limit = 10, filter = {}, orderBy = {}): Promise<any> {
    try {
        const skip = (page - 1) * limit;
        const [recipes, total] = await Promise.all([
            prisma.recipe.findMany({
                skip,
                take: limit,
                where: filter,
                include: {
                    recipeIngredients: {
                        include: {
                            product: true
                        }
                    },
                    createdBy: {
                        select: {
                            id: true,
                            name: true,
                            image: true
                        }
                    }
                },
                orderBy: {
                    ...orderBy || { createdAt: 'desc' }
                }
            }),
            prisma.recipe.count({ where: filter })
        ]);

        return JSON.parse(JSON.stringify({
            recipes,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        }));
    } catch (error) {
        console.error("Erreur lors de la récupération des recettes :", error);
        throw new Error('La récupération des recettes a échoué.');
    }
}

// Mettre à jour une recette
export async function updateRecipe(id: string, data: UpdateRecipeInput): Promise<any> {
    try {
        const { ingredients, steps, ...recipeData } = data;

        // Mise à jour des données de base
        await prisma.recipe.update({
            where: { id },
            data: recipeData
        });

        // Mise à jour des ingrédients si fournis
        if (ingredients) {
            await prisma.recipeIngredient.deleteMany({
                where: { recipeId: id }
            });

            await prisma.recipeIngredient.createMany({
                data: ingredients.map(ing => ({
                    recipeId: id,
                    productId: ing.productId,
                    quantity: new Prisma.Decimal(ing.quantity),
                    unit: ing.unit
                }))
            });
        }

        // Mise à jour des étapes si fournies
        if (steps) {
            await prisma.recipeStep.deleteMany({
                where: { recipeId: id }
            });

            await prisma.recipeStep.createMany({
                data: steps.map(step => ({
                    recipeId: id,
                    ...step
                }))
            });
        }

        // Récupérer la recette mise à jour
        const updatedRecipe = await getRecipeById(id);
        return JSON.parse(JSON.stringify(updatedRecipe));
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la recette :", error);
        throw new Error('La mise à jour de la recette a échoué.');
    }
}

// Supprimer une recette
export async function deleteRecipe(id: string): Promise<any> {
    try {
        await prisma.recipeIngredient.deleteMany({
            where: { recipeId: id }
        });

        await prisma.recipeStep.deleteMany({
            where: { recipeId: id }
        });

        const recipe = await prisma.recipe.delete({
            where: { id }
        });

        return JSON.parse(JSON.stringify(recipe));
    } catch (error) {
        console.error("Erreur lors de la suppression de la recette :", error);
        throw new Error('La suppression de la recette a échoué.');
    }
}

// Basculer les favoris
export async function toggleRecipeFavorite(recipeId: string, userId: string): Promise<any> {
    try {
        const recipe = await prisma.recipe.findUnique({
            where: { id: recipeId },
            include: {
                favoritedBy: {
                    where: { id: userId }
                }
            }
        });

        if (!recipe) {
            throw new Error('Recipe not found');
        }

        const isFavorited = recipe.favoritedBy.length > 0;
        const updatedRecipe = await prisma.recipe.update({
            where: { id: recipeId },
            data: {
                favoritedBy: {
                    [isFavorited ? 'disconnect' : 'connect']: { id: userId }
                }
            }
        });

        return JSON.parse(JSON.stringify({
            recipe: updatedRecipe,
            isFavorited: !isFavorited
        }));
    } catch (error) {
        console.error("Erreur lors de la modification des favoris :", error);
        throw new Error('La modification des favoris a échoué.');
    }
}

// Rechercher des recettes
export async function searchRecipes(searchTerm: string, page = 1, limit = 10): Promise<any> {
    try {
        const where = {
            OR: [
                { name: { contains: searchTerm } },
                { description: { contains: searchTerm } },
                { instructions: { contains: searchTerm } }
            ]
        };

        return getAllRecipes(page, limit, where);
    } catch (error) {
        console.error("Erreur lors de la recherche des recettes :", error);
        throw new Error('La recherche des recettes a échoué.');
    }
}

// Récupérer les recettes par type
export async function getRecipesByType(type: RecipeType, page = 1, limit = 10): Promise<any> {
    try {
        return getAllRecipes(page, limit, { type });
    } catch (error) {
        console.error("Erreur lors de la récupération des recettes par type :", error);
        throw new Error('La récupération des recettes par type a échoué.');
    }
}

// Récupérer les recettes favorites d'un utilisateur
export async function getUserFavoriteRecipes(userId: string, page = 1, limit = 10): Promise<any> {
    try {
        return getAllRecipes(page, limit, { favoritedBy: { some: { id: userId } } });
    } catch (error) {
        console.error("Erreur lors de la récupération des recettes favorites :", error);
        throw new Error('La récupération des recettes favorites a échoué.');
    }
}

// Récupérer les recettes créées par un utilisateur
export async function getUserCreatedRecipes(userId: string, page = 1, limit = 10): Promise<any> {
    try {
        return getAllRecipes(page, limit, { userId });
    } catch (error) {
        console.error("Erreur lors de la récupération des recettes créées :", error);
        throw new Error('La récupération des recettes créées a échoué.');
    }
}