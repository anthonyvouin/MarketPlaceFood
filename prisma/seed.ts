import { createProduct } from '../app/services/products/product';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fetchOpenFoodFactsProducts() {
  const url = "https://world.openfoodfacts.org/api/v2/search?fields=code,product_name_fr,generic_name_fr,categories_tags_fr,stores_tags,prices_tags,image_url&page_size=50&filter";
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data || !data.products) {
      throw new Error('Erreur lors de la récupération des données depuis OpenFoodFacts');
    }
    
    return data.products;
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API OpenFoodFacts :", error);
    throw new Error("L'appel à l'API OpenFoodFacts a échoué");
  }
}

async function findOrCreateCategory(categories: string[]): Promise<string> {
  if (!categories || categories.length === 0) {
    throw new Error("Catégorie non disponible pour ce produit");
  }

  const categoryName = categories[0];

  let category = await prisma.category.findUnique({
    where: { name: categoryName },
  });

  if (!category) {
    category = await prisma.category.create({
      data: { name: categoryName },
    });
  }

  return category.id;
}

async function seedOpenFoodFactsProducts() {
  try {
    const productsFromAPI = await fetchOpenFoodFactsProducts();

    for (const product of productsFromAPI) {
      if (!product.product_name_fr || !product.generic_name_fr || !product.categories_tags_fr) {
        continue;
      }

      // On regarde si le slug existe déjà
      const existingProduct = await prisma.product.findUnique({
        where: { slug: generateSlug(product.product_name_fr) },
      });

      if (existingProduct) {
        console.log(`Le produit avec le slug ${existingProduct.slug} existe déjà. Ignoré.`);
        continue;
      }
      
      const formattedProduct = {
        name: product.product_name_fr,
        slug: generateSlug(product.product_name_fr),
        description: product.generic_name_fr,
        image: product.image_url || "",
        price: new Prisma.Decimal(product.prices_tags && product.prices_tags[0] ? parseFloat(product.prices_tags[0]).toFixed(2) : (Math.random() * 10).toFixed(2)),
        categoryId: await findOrCreateCategory(product.categories_tags_fr),
      };

      console.log('Création du produit :', formattedProduct);

      await createProduct(formattedProduct);
    }

    console.log('Le seeding des produits depuis OpenFoodFacts est terminé.');
  } catch (error) {
    console.error("Erreur lors du seeding des produits :", error);
  }
}

function generateSlug(productName: string): string {
  // En minuscule
  let slug = productName.toLowerCase();
  // On récupère les espaces pour les transformer en -
  slug = slug.replace(/\s+/g, '-');
  // et on exclu les caractères spéciaux => ^ = not en regex
  slug = slug.replace(/[^a-z0-9-]/g, '');
  return slug;
}

seedOpenFoodFactsProducts()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
