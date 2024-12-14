"use server";

import OpenAI from "openai";
import { getAllProducts } from "../products/product";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ""
});

export async function analysePicture(format: string = 'recipe', imageUrl: string) {
  try {
    // Définir les prompts en fonction du format
    const data = {
      recipe: {
        prompt: "Je vais te fournir l'image d'un plat cuisiné. Analyse l'image et donne moi le nom du plat et ensuite décris le plat en identifiant les ingrédients principaux. Pour chaque ingrédient, indique la quantité nécessaire afin de pouvoir refaire le plat pour une personne. La description doit être précise et détaillée, en mentionnant les éléments visibles",
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "response",
            schema: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "Nom du plat",
                  required: ["name"]
                },
                ingredients: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: {
                        type: "string",
                        description: "Nom de l'ingrédient",
                        required: ["name"]
                      },
                      quantity: {
                        type: "string",
                        description: "Quantité de l'ingrédient",
                        required: ["quantity"]
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      fridge: {
        prompt: "Analyse l'image de ce réfrigérateur. Décris et liste les aliments visibles. Ne pas oublier de mentionner les plats préparés ou les restes, s'il y en a (par exemple : un bol de pâtes).",
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "response",
            schema: {
              type: "object",
              properties: {
                ingredients: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: {
                        type: "string",
                        description: "Nom de l'ingrédient",
                        required: ["name"]
                      },
                      quantity: {
                        type: "string",
                        description: "Quantité de l'ingrédient",
                        required: ["quantity"]
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    };

    const prompt = data[format].prompt || data.recipe.prompt;

    // const fullImageUrl = `${process.env.NEXT_PUBLIC_APP_URL}${imageUrl}`

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: { url:  imageUrl }
            }
          ]
        },
      ],
      response_format: data[format].response_format || data.recipe.prompt
    });

    const responseContent = response.choices[0].message.content;

    const parsedResponse = JSON.parse(responseContent);

    return parsedResponse;

  } catch (error) {
    console.error('Erreur lors de l\'analyse de l\'image :', error);
    throw error;
  }
}

export async function generateRecipes(format: string, complement: string = "", products?: any, recipeName?: string) {
  try {
    let formattedIngredients = null

    let prompt = ""
    
    switch (format) {
      case "generate-steps":
        prompt = "Je vais te fournir les détails d'une recette comprenant son nom, sa description, son temps de préparation, le nombre de personnes, et ses ingrédients. Tu devras me retourner un tableau d'objets JSON bien formaté représentant chaque étape de la recette.";
        break;
      case "generate-recipes-from-fridge":
        formattedIngredients = JSON.stringify(products)
        prompt = "Je vais te fournir une liste d'ingrédients alimentaires. tu devras créer un tableau de recettes (maximum 1 recette). Chaque recette sera cohérente, délicieuse et réalisable avec les ingrédients fournis. La cohérence entre les ingrédients est essentielle : chaque recette sera construite de manière logique avec des ingrédients qui se marient bien ensemble. J'utiliserai uniquement les ingrédients de la liste, ainsi que du sel et du poivre.";
        break;
      case "generate-recipes-from-cart":
        formattedIngredients = JSON.stringify(products)
        prompt = "Je vais te fournir une liste d'ingrédients alimentaires. À partir de cette liste, tu devras créer un tableau de recettes (maximum 1 recette). Chaque recette sera cohérente, délicieuse et réalisable avec les ingrédients fournis. La cohérence entre les ingrédients est essentielle : chaque recette sera construite de manière logique avec des ingrédients qui se marient bien ensemble. J'utiliserai uniquement les ingrédients de la liste, ainsi que du sel et du poivre.";
        break;
      case "generate-recipe-from-image-of-recipe":
        formattedIngredients = JSON.stringify(products)
        prompt = `Génère moi une recette pour le plat suivant : ${recipeName}. Tu devras me retourner un tableau qui contient le nom de la recette que je t'ai donnée et la liste des ingrédients que je t'ai donnée.`
        break;
      default:
        // generate-recipes-from-bdd
        const ingredients = await getAllProducts({ id: true, name: true, price: true })
        formattedIngredients = JSON.stringify(ingredients)
        prompt = "Je vais te fournir une liste d'ingrédients alimentaires. À partir de cette liste, je vais créer un tableau de recettes (maximum 3 recettes) conçues pour impressionner les convives. Chaque recette sera cohérente, délicieuse et réalisable avec les ingrédients fournis. La cohérence entre les ingrédients est essentielle : chaque recette sera construite de manière logique avec des ingrédients qui se marient bien ensemble. J'utiliserai uniquement les ingrédients de la liste, ainsi que du sel et du poivre.";
      // prompt = "Je vais te passer un tableau d'objet (sans le format JSON) de produits et tu devras me sortir un tableau d'objet (sans le format JSON) de recettes qui te semblent pertinentes, sans commentaire, chaque recette doit contenir un nom (name), une description (description), une catégorie (category) qui doit être une des propositions suivantes: Apéritif, Entrée, Plat, Dessert, Gourmandise et un tableau d'ingrédients qui contient les id des produits que tu veux utiliser et la quantité associé à chaque produit et pour chaque recette"
    }

    let formatOfReturn: { type: string; json_schema: any } | null = null
    const message: { role: string; content: string }[] = []
    message.push({
      role: "system",
      content: "Tu es une API utilisée par un site ecommerce de produits alimentaires et un site de recettes de cuisine. Tu as la capacité de générer des recettes de cuisine à partir d'ingrédients donnés. Tu peux créer des recettes de chef culinaire renommé, expert en gastronomie. Ton objectif est de proposer des recettes cohérentes et délicieuses en sélectionnant des ingrédients adaptés à chaque plat tout en respectant les traditions et les associations culinaires appropriées."
    }, {
      role: "system",
      content: "Tu dois répondre en français, que ce soit le nom des recettes, les descriptions, les ingrédients, les étapes de préparation, les quantités, les unités de mesure, les temps de préparation et de cuisson, les images, les difficultés"
    },{
      role: "user",
      content: prompt
    })

    if (format !== "generate-steps") {
      if (formattedIngredients.length > 0) {
        if (formattedIngredients) {
          message.push({
            role: "user",
            content: formattedIngredients
          });
        }
      }

      formatOfReturn = {
        type: "json_schema",
        json_schema: {
          name: "recipes",
          schema: {
            type: "object",
            properties: {
              recipes: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      description: "Nom de la recette",
                      required: ["name", "description", "type", "slug", "difficulty", "preparationTime", "cookingTime", "servings", "image", "ingredients"]
                    },
                    englishName: {
                      type: "string",
                      description: "Nom de la recette en anglais",
                      required: ["englishName"]
                    },
                    description: {
                      type: "string",
                      description: "Description de la recette",
                      required: ["description"]
                    },
                    // image_decoration_url: {
                    //   type: "string",
                    //   description: "Chemin de l'image de décoration",
                    //   required: ["image_decoration_url"]
                    // },
                    type: {
                      type: "string",
                      description: "Type de la recette (STARTER, MAIN_DISH, DESSERT, SNACK, SIDE_DISH, BREAKFAST, BEVERAGE)",
                      required: ["type"]
                    },
                    slug: {
                      type: "string",
                      description: "Slug généré à partir du nom en minuscules et sans espaces",
                      required: ["slug"]
                    },
                    difficulty: {
                      type: "string",
                      description: "Difficulté de la recette (ex: 'Facile')",
                      required: ["difficulty"]
                    },
                    preparationTime: {
                      type: "integer",
                      description: "Temps de préparation en minutes",
                      required: ["preparationTime"]
                    },
                    cookingTime: {
                      type: "integer",
                      description: "Temps de cuisson en minutes",
                      required: ["cookingTime"]
                    },
                    servings: {
                      type: "integer",
                      description: "Nombre de portions",
                      required: ["servings"]
                    },
                    image: {
                      type: "string",
                      description: "Chemin de l'image",
                      required: ["image"]
                    },
                    ingredients: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: {
                            type: "string",
                            description: "Nom de l'ingrédient",
                            required: ["name"]
                          },
                          quantity: {
                            type: "number",
                            description: "Quantité du produit",
                            required: ["quantity"]
                          },
                          unit: {
                            type: "string",
                            description: "Unité de la quantité",
                            required: ["unit"]
                          }
                        }
                      },
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      message.push({
        role: "user",
        content: JSON.stringify(complement)
      })
      message.push({
        role: "user",
        content: "Assures-toi que les ingrédients sélectionnés sont cohérents entre eux et adaptés au type de recette."
      })

      formatOfReturn = {
        type: "json_schema",
        json_schema: {
          name: "step",
          schema: {
            type: "object",
            properties: {
              steps: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    stepNumber: {
                      type: "number",
                      description: "Étape de la recette",
                      required: ["stepNumber"]
                    },
                    description: {
                      type: "string",
                      description: "Description de l'étape de la recette",
                      required: ["description"]
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    //? ça marche bien j'ai l'impression
    const response = await openai.chat.completions.create({
      "model": "gpt-4o",
      "messages": message,
      response_format: formatOfReturn || undefined
    });

    let recipesFormatted;
    try {
      let responseContent = response?.choices[0]?.message?.content;

      recipesFormatted = JSON.parse(responseContent);
      if (recipesFormatted.recipes) {
        recipesFormatted = recipesFormatted.recipes
      }

    } catch (error) {
      console.error("Failed to parse JSON response:", error);
      return null;
    }

    return recipesFormatted

  } catch (error) {
    console.error("ici", error)
  }
}