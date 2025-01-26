import { RecipeStepDto } from "./RecipeStepDto";

export interface RecipeDto {
    englishName?: string;
    id: string;
    slug: any;
    recipeIngredients: any;
    recipeMissingIngredientReports: any;
    category: string;
    description: string;
    name: string;
    preparationTime: number;
    cookingTime: number;
    servings: number;
    ingredients: {
        name: string;
        quantity: string;
    }[];
    steps: RecipeStepDto[];
    image: string;
    difficulty: string;
    type: RecipeType;
}

export enum RecipeType {
    STARTER = 'starter', // Entrée
    MAIN_DISH = 'main_dish', // Plat principal
    DESSERT = 'dessert', // Dessert
    SNACK = 'snack', // Gourmandise/Snack
    SIDE_DISH = 'side_dish', // Accompagnement
    BREAKFAST = 'breakfast', // Petit-déjeuner
    BEVERAGE = 'beverage' // Boisson
}