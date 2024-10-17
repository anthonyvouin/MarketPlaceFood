"use server";

import OpenAI from "openai";
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || ""
});

export async function generateRecipes() {
    const completion = await openai.chat.completions.create({

        "model": "gpt-4o-mini",
        "messages": [
            {
                "role": "system",
                "content": "Tu es un chef culinaire renommé"
            },
            {
                "role": "user",
                "content": "Je vais te passer un JSON et tu devras me sortir des recettes qui te semblent pertinentes en format JSON"
            },
            {
                "role": "user",
                "content": "[\n  {\n    \"id\": \"1\",\n    \"name\": \"Tomato\",\n    \"slug\": \"tomato\",\n    \"description\": \"Fresh organic tomatoes\",\n    \"image\": \"https://example.com/images/tomato.jpg\",\n    \"price\": 2.5,\n    \"createdAt\": \"2023-10-01T10:00:00Z\",\n    \"updatedAt\": \"2023-10-05T12:00:00Z\",\n    \"categoryId\": \"vegetable\",\n    \"category\": {\n      \"id\": \"vegetable\",\n      \"name\": \"Vegetables\"\n    }\n  },\n  {\n    \"id\": \"2\",\n    \"name\": \"Chicken Breast\",\n    \"slug\": \"chicken-breast\",\n    \"description\": \"Skinless chicken breast fillets\",\n    \"image\": \"https://example.com/images/chicken-breast.jpg\",\n    \"price\": 8.99,\n    \"createdAt\": \"2023-10-01T11:00:00Z\",\n    \"updatedAt\": \"2023-10-05T12:30:00Z\",\n    \"categoryId\": \"meat\",\n    \"category\": {\n      \"id\": \"meat\",\n      \"name\": \"Meat\"\n    }\n  },\n  {\n    \"id\": \"3\",\n    \"name\": \"Basil\",\n    \"slug\": \"basil\",\n    \"description\": \"Fresh basil leaves\",\n    \"image\": \"https://example.com/images/basil.jpg\",\n    \"price\": 1.2,\n    \"createdAt\": \"2023-10-02T09:00:00Z\",\n    \"updatedAt\": \"2023-10-06T14:00:00Z\",\n    \"categoryId\": \"herb\",\n    \"category\": {\n      \"id\": \"herb\",\n      \"name\": \"Herbs\"\n    }\n  },\n  {\n    \"id\": \"4\",\n    \"name\": \"Spaghetti\",\n    \"slug\": \"spaghetti\",\n    \"description\": \"Italian spaghetti pasta\",\n    \"image\": \"https://example.com/images/spaghetti.jpg\",\n    \"price\": 3.5,\n    \"createdAt\": \"2023-10-02T12:00:00Z\",\n    \"updatedAt\": \"2023-10-07T13:00:00Z\",\n    \"categoryId\": \"pasta\",\n    \"category\": {\n      \"id\": \"pasta\",\n      \"name\": \"Pasta\"\n    }\n  },\n  {\n    \"id\": \"5\",\n    \"name\": \"Olive Oil\",\n    \"slug\": \"olive-oil\",\n    \"description\": \"Extra virgin olive oil\",\n    \"image\": \"https://example.com/images/olive-oil.jpg\",\n    \"price\": 6.0,\n    \"createdAt\": \"2023-10-03T10:30:00Z\",\n    \"updatedAt\": \"2023-10-08T12:45:00Z\",\n    \"categoryId\": \"oil\",\n    \"category\": {\n      \"id\": \"oil\",\n      \"name\": \"Oils\"\n    }\n  },\n  {\n    \"id\": \"6\",\n    \"name\": \"Garlic\",\n    \"slug\": \"garlic\",\n    \"description\": \"Organic garlic bulbs\",\n    \"image\": \"https://example.com/images/garlic.jpg\",\n    \"price\": 1.0,\n    \"createdAt\": \"2023-10-03T11:00:00Z\",\n    \"updatedAt\": \"2023-10-08T13:15:00Z\",\n    \"categoryId\": \"vegetable\",\n    \"category\": {\n      \"id\": \"vegetable\",\n      \"name\": \"Vegetables\"\n    }\n  },\n  {\n    \"id\": \"7\",\n    \"name\": \"Parmesan Cheese\",\n    \"slug\": \"parmesan-cheese\",\n    \"description\": \"Grated parmesan cheese\",\n    \"image\": \"https://example.com/images/parmesan.jpg\",\n    \"price\": 4.5,\n    \"createdAt\": \"2023-10-04T10:00:00Z\",\n    \"updatedAt\": \"2023-10-09T11:00:00Z\",\n    \"categoryId\": \"dairy\",\n    \"category\": {\n      \"id\": \"dairy\",\n      \"name\": \"Dairy\"\n    }\n  },\n  {\n    \"id\": \"8\",\n    \"name\": \"Lemon\",\n    \"slug\": \"lemon\",\n    \"description\": \"Fresh organic lemons\",\n    \"image\": \"https://example.com/images/lemon.jpg\",\n    \"price\": 0.7,\n    \"createdAt\": \"2023-10-04T12:00:00Z\",\n    \"updatedAt\": \"2023-10-09T12:30:00Z\",\n    \"categoryId\": \"fruit\",\n    \"category\": {\n      \"id\": \"fruit\",\n      \"name\": \"Fruits\"\n    }\n  },\n  {\n    \"id\": \"9\",\n    \"name\": \"Butter\",\n    \"slug\": \"butter\",\n    \"description\": \"Unsalted butter\",\n    \"image\": \"https://example.com/images/butter.jpg\",\n    \"price\": 3.0,\n    \"createdAt\": \"2023-10-05T09:00:00Z\",\n    \"updatedAt\": \"2023-10-10T10:00:00Z\",\n    \"categoryId\": \"dairy\",\n    \"category\": {\n      \"id\": \"dairy\",\n      \"name\": \"Dairy\"\n    }\n  },\n  {\n    \"id\": \"10\",\n    \"name\": \"Salt\",\n    \"slug\": \"salt\",\n    \"description\": \"Sea salt\",\n    \"image\": \"https://example.com/images/salt.jpg\",\n    \"price\": 0.5,\n    \"createdAt\": \"2023-10-05T14:00:00Z\",\n    \"updatedAt\": \"2023-10-10T15:00:00Z\",\n    \"categoryId\": \"condiment\",\n    \"category\": {\n      \"id\": \"condiment\",\n      \"name\": \"Condiments\"\n    }\n  }\n]"

            }
        ]
    });
    return completion.choices[0].message;
}
