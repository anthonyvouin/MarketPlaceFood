"use server";

import OpenAI from "openai";
import { getAllProducts } from "../products/product";
import ollama from 'ollama'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ""
});

export async function analysePicture(format: string) {
  let response = null
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

    const ingredients = await getAllProducts({ id: true, name: true, price: true })

    // console.log(ingredients)

    const formattedIngredients = JSON.stringify(ingredients)

    // console.log(formattedIngredients)

    // return ingredients
    let prompt = ""
    switch (format) {
      case "generate-recipes-from-fridge":
        prompt = "Je vais te passer une description de réfrigérateur et tu devras me sortir un tableau d'objet (sans nombre) de recettes qui te semblent pertinentes, sans commentaire, chaque recette doit contenir un nom (name), une description (description), une catégorie (category) qui doit être une des propositions suivantes: Apéritif, Entrée, Plat, Dessert, Gourmandise et un tableau d'ingrédients qui contient les id des produits que tu veux utiliser et la quantité associé à chaque produit"
      case "generate-recipes-from-cart":
        prompt = "Je vais te passer un tableau d'objet (sans le format JSON) de produits et tu devras me sortir un tableau d'objet (sans le format JSON) de recettes qui te semblent pertinentes, sans commentaire, chaque recette doit contenir un nom (name), une description (description), une catégorie (category) qui doit être une des propositions suivantes: Apéritif, Entrée, Plat, Dessert, Gourmandise et un tableau d'ingrédients qui contient les id des produits que tu veux utiliser et la quantité associé à chaque produit"
      default:
        // generate-recipes-from-bdd
        prompt = "Je vais te fournir une liste d'objets représentant des produits. À partir de cette liste, génère un tableau de recettes (maximum 3 recettes) strictement formaté en JSON, structuré comme suit : chaque recette doit inclure un 'name', 'description', 'type' (avec l'une des valeurs suivantes : STARTER, MAIN_DISH, DESSERT, SNACK, SIDE_DISH, BREAKFAST, ou BEVERAGE), 'slug' (généré à partir du nom en minuscules et sans espaces), 'difficulty' (ex: 'Facile'), 'preparationTime' (nombre de minutes, mettre juste le nombre de minutes en int), 'cookingTime' (nombre de minutes, mettre juste le nombre de minutes en int), 'servings', 'image' (chemin de l'image), et un tableau 'ingredients' comprenant pour chaque ingrédient l'id du produit ('productId'), la 'quantity', et l'unit. La sortie doit être strictement au format JSON, sans explications ni commentaires.";
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

    //? ça marche bien j'ai l'impression
    response = await openai.chat.completions.create({
      "model": "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Tu es un chef culinaire renommé"
        }, {
          role: "user",
          content: prompt
        }, {
          role: "user",
          content: formattedIngredients
        }
      ]
    });

    // console.log(response.choices[0].message.content)
    let recipesFormatted;
    try {
      let responseContent = response?.choices[0]?.message?.content;

      // Nettoyer la réponse pour supprimer les balises Markdown
      responseContent = responseContent.replace(/```json/g, '').replace(/```/g, '').trim();

      // Essayer de parser la réponse nettoyée
      recipesFormatted = JSON.parse(responseContent);
    } catch (error) {
      console.log("Réponse brute :", response);
      console.error("Failed to parse JSON response:", error);
      return null;
    }

    return recipesFormatted


  } catch (error) {
    console.error(error)
  }
}

export async function generateRecipes() {
  const fields = {
    id: true,
    name: true,
    slug: false,
    description: true,
    image: false,
    price: true,
    createdAt: false,
    updatedAt: false,
    categoryId: false,
  };
  let ingredients = await getAllProducts(fields);
  ingredients = ingredients.slice(0, 10);
  console.log(ingredients);
  const completion = await openai.chat.completions.create({

    "model": "gpt-4o-mini",
    "messages": [
      {
        "role": "system",
        "content": "Tu es un chef culinaire renommé"
      },
      {
        "role": "user",
        "content": "Je vais te passer un JSON et tu devras me sortir un tableau d'objet (sans le format JSON) de recettes qui te semblent pertinentes, sans commentaire"
      },
      {
        "role": "user",
        // "Le résultat doit être un tableau de recettes, chaque recette doit contenir un nom, une description, un nombre de personnes, un prix, une catégorie (Apéritif, Entrée, Plat, Dessert, Gourmandise) et un tableau d'ingrédients qui contient les id des produits que tu veux utiliser et la quantité associé à chaque produit"
        "content": "Le résultat doit être un tableau de recettes, chaque recette doit contenir un nom (name), une description (description), une catégorie (category) qui doit être une des propositions suivantes: Apéritif, Entrée, Plat, Dessert, Gourmandise"
      },
      {
        "role": "user",
        "content": JSON.stringify(ingredients)
      }
    ]
  });
  const result = JSON.parse(completion?.choices[0]?.message?.content);
  return result;

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
