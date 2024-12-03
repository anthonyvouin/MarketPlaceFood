"use server";

import OpenAI from "openai";
import { getAllProducts } from "../products/product";
import ollama, { ChatResponse } from 'ollama'
import fetch from 'node-fetch';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ""
});

export async function analysePicture(format: string = 'recipe') {
  try {
    // Définir les prompts en fonction du format
    const prompts = {
      recipe: "Je vais te fournir l'image d'un plat cuisiné. Analyse l'image et donne moi le nom du plat et ensuite décris le plat en identifiant les ingrédients principaux. Pour chaque ingrédient, indique la quantité nécessaire afin de pouvoir refaire le plat pour une personne. La description doit être précise et détaillée, en mentionnant les éléments visibles",
      fridge: "Analyse l'image de ce réfrigérateur. Décris et liste les aliments visibles en les triant par catégories (par exemple : produits laitiers, fruits et légumes, viandes, boissons, condiments, etc.). Pour chaque aliment, indique sa quantité si elle est perceptible (par exemple : un paquet de yaourts, trois pommes, une bouteille de lait), son emplacement spécifique dans le réfrigérateur (par exemple : sur l'étagère du haut, dans le tiroir du bas) et s'il est ouvert ou fermé, si visible. Ne pas oublier de mentionner les plats préparés ou les restes, s'il y en a, en précisant leur type (par exemple : un bol de pâtes)."
    };

    const prompt = prompts[format] || prompts.recipe;

    // URL de l'image (vous pouvez la remplacer)
    // const imageUrl = "https://lapetitebette.com/wp-content/uploads/2023/08/IMG_9826-e1693513597226-1200x879.jpg";
    const imageUrl = "https://img.cuisineaz.com/660x660/2023/11/20/i196570-tiramisu-simple.jpg";
    //! Image = ['png', 'jpeg', 'gif', 'webp'].

    // Télécharger l'image et la convertir en base64
    // const response = await fetch(imageUrl);
    // const arrayBuffer = await response.arrayBuffer();
    // const base64Image = `${Buffer.from(arrayBuffer).toString('base64')}`;
    // // Appel à Ollama/LLaVA
    // const llamaResponse = await ollama.chat({
    //   model: 'llava:13b',
    //   stream: false,
    //   messages: [{
    //     role: 'user',
    //     content: prompt,
    //     images: [base64Image]
    //   }]
    // });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: { url: imageUrl },
            }
          ]
        },
      ],
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
    });

    const responseContent = response.choices[0].message.content;

    const parsedResponse = JSON.parse(responseContent);

    return parsedResponse;

  } catch (error) {
    console.error('Erreur lors de l\'analyse de l\'image :', error);
    throw error;
  }
}

export async function generateRecipes(format: string, complement: string = "", products?: any) {
  try {
    //     response = await ollama.chat( {
    //       "model": "llava",
    //       "stream": false,
    //       messages: [{
    //         role: "user",
    //         content:"Analyse l'image de ce réfrigérateur. Décris et liste les aliments visibles en les triant par catégories (par exemple : produits laitiers, fruits et légumes, viandes, boissons, condiments, etc.). Pour chaque aliment, indique sa quantité si elle est perceptible (par exemple : un paquet de yaourts, trois pommes, une bouteille de lait), son emplacement spécifique dans le réfrigérateur (par exemple : sur l'étagère du haut, dans le tiroir du bas) et s'il est ouvert ou fermé, si visible. Ne pas oublier de mentionner les plats préparés ou les restes, s'il y en a, en précisant leur type (par exemple : un bol de pâtes).",
    // images : [""]
    //       }]
    //     })

    // response = await openai.chat.completions.create({
    //   "model": "mistral",
    //   "stream": false,
    //   messages: [{
    //     role: "user",
    //     content: "Je vais te passer une description de réfrigérateur et tu devras me sortir un tableau d'objet (sans le format JSON) de recettes qui te semblent pertinentes, sans commentaire"
    //   }, {
    //     role: "user",
    //     content: llava?.message?.content || "No response available"
    //   }
    // ]
    // });

    let formattedIngredients = null

    let prompt = ""
    // return
    switch (format) {
      case "generate-steps":
        prompt = "Je vais te fournir les détails d'une recette comprenant son nom, sa description, son temps de préparation, le nombre de personnes, et ses ingrédients. Tu devras me retourner un tableau d'objets JSON bien formaté représentant chaque étape de la recette.";
        break;
      case "generate-recipes-from-fridge":
        prompt = "Je vais te passer une description de réfrigérateur et tu devras me sortir un tableau d'objet (sans nombre) de recettes qui te semblent pertinentes, sans commentaire, chaque recette doit contenir un nom (name), une description (description), une catégorie (category) qui doit être une des propositions suivantes: Apéritif, Entrée, Plat, Dessert, Gourmandise et un tableau d'ingrédients qui contient les id des produits que tu veux utiliser et la quantité associé à chaque produit"
        break;
      case "generate-recipes-from-cart":
        formattedIngredients = JSON.stringify(products)
        prompt = "Je vais te fournir une liste d'objets représentant des produits. À partir de cette liste, génère un tableau de recettes (maximum 2 recettes";
        break;
      default:
        // generate-recipes-from-bdd
        const ingredients = await getAllProducts({ id: true, name: true, price: true })
        formattedIngredients = JSON.stringify(ingredients)
        prompt = "Je vais te fournir une liste d'ingrédients alimentaires. À partir de cette liste, je vais créer un tableau de recettes (maximum 3 recettes) conçues pour impressionner les convives. Chaque recette sera cohérente, délicieuse et réalisable avec les ingrédients fournis. La cohérence entre les ingrédients est essentielle : chaque recette sera construite de manière logique avec des ingrédients qui se marient bien ensemble. J'utiliserai uniquement les ingrédients de la liste, ainsi que du sel et du poivre. De plus, chaque recette inclura tous les produits de la liste.";
      // prompt = "Je vais te passer un tableau d'objet (sans le format JSON) de produits et tu devras me sortir un tableau d'objet (sans le format JSON) de recettes qui te semblent pertinentes, sans commentaire, chaque recette doit contenir un nom (name), une description (description), une catégorie (category) qui doit être une des propositions suivantes: Apéritif, Entrée, Plat, Dessert, Gourmandise et un tableau d'ingrédients qui contient les id des produits que tu veux utiliser et la quantité associé à chaque produit et pour chaque recette"
    }
    // response = await ollama.chat({
    //   "model": "mistral",
    //   "stream": false,
    //   messages: [{
    //     role: "user",
    //     content: prompt
    //   }, {
    //     role: "user",
    //     content: formattedIngredients
    //   }
    // ]
    // });

    let formatOfReturn: { type: string; json_schema: any } | null = null
    const message: { role: string; content: string }[] = []
    message.push({
      role: "system",
      content: "Tu es une API utilisée par un site ecommerce de produits alimentaires et un site de recettes de cuisine. Tu as la capacité de générer des recettes de cuisine à partir d'ingrédients donnés. Tu peux créer des recettes de chef culinaire renommé, expert en gastronomie. Ton objectif est de proposer des recettes cohérentes et délicieuses en sélectionnant des ingrédients adaptés à chaque plat tout en respectant les traditions et les associations culinaires appropriées."
    }, {
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
                    description: {
                      type: "string",
                      description: "Description de la recette",
                      required: ["description"]
                    },
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
                          productId: {
                            type: "string",
                            description: "ID du produit",
                            required: ["productId"]
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

    // console.log(response.choices[0].message.content)
    let recipesFormatted;
    try {
      let responseContent = response?.choices[0]?.message?.content;
      // responseContent = responseContent.recipes

      // Nettoyer la réponse pour supprimer les balises Markdown
      // responseContent = responseContent.replace(/```json/g, '').replace(/```/g, '').trim();

      // Essayer de parser la réponse nettoyée
      recipesFormatted = JSON.parse(responseContent);
      console.log(recipesFormatted)
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
// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY || ""
// });

// export async function analysePicture() {
//   const imageUrl = "https://img.cuisineaz.com/1024x768/2022/09/09/i187689-cette-erreur-que-tout-le-monde-commet-avec-son-frigo-et-qui-fait-exploser-la-facture-d-electricite.jpg";

//   const response = await openai.chat.completions.create({
//     model: "gpt-4",
//     messages: [
//       {
//         role: "user",
//         content: [
//           { type: "text", text: "Analyse l'image de ce réfrigérateur. Décris et liste les aliments visibles en les triant par catégories (par exemple : produits laitiers, fruits et légumes, viandes, boissons, condiments, etc.). Pour chaque aliment, indique sa quantité si elle est perceptible (par exemple : un paquet de yaourts, trois pommes, une bouteille de lait), son emplacement spécifique dans le réfrigérateur (par exemple : sur l'étagère du haut, dans le tiroir du bas) et s'il est ouvert ou fermé, si visible. Ne pas oublier de mentionner les plats préparés ou les restes, s'il y en a, en précisant leur type (par exemple : un bol de pâtes)." },
//           {
//             type: "image_url",
//             image_url: { url: imageUrl },
//           }
//         ]
//       }
//     ],
//   });
//   console.log(response.choices[0].message.content);
//   return response.choices[0].message.content;
// }
