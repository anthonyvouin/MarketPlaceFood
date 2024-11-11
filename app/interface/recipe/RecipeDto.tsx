export interface RecipeDto {
    category: string;
    description: string;
    name: string;
    preparationTime: number;
    cookingTime: number;
    servings: number;
    ingredients: string[];
    // steps: StepDto[];
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