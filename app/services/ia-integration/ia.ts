"use server";

import OpenAI from "openai";
import { getAllProducts } from "../products/product";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ""
});

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
