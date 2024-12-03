"use server"

import Fuse from 'fuse.js';
import {Prisma, PrismaClient, Product} from '@prisma/client';
import {ProductDto} from '@/app/interface/product/productDto';
import {CategoryDto} from "@/app/interface/category/categoryDto";
import {DiscountDto} from "@/app/interface/discount/discountDto";

const prisma = new PrismaClient();

const fuseOptions = {
    includeScore: true,
    shouldSort: true,
    threshold: 0.2,
    keys: ['name'],
    findAllMatches: false,
    minMatchCharLength: 2
};

// export type ProductWithCategory = Prisma.ProductGetPayload<{
//     include: { category: true };
// }>;

export async function createProduct(product: ProductDto): Promise<ProductDto> {

    if (!product.image) {
        product.image = '/images/default-image.png';
    }

    // if (!product.name || !product.slug || !product.description || !product.image || product.price == null || !product.categoryId) {
    //     throw new Error('Tous les champs (nom, slug, description, image, prix, identifiant de catégorie) sont requis.');
    // }

    const existingName: Product | null = await prisma.product.findUnique({
        where: {name: product.name}
    })

    if (existingName) {
        throw new Error('Ce nom est déjà utilisé sur un autre produit');
    }

    const existingSlug: Product | null = await prisma.product.findUnique({
        where: {slug: product.slug}
    })

    if (existingSlug) {
        throw new Error('Ce slug est déjà attribué à un autre produit');
    }

    try {
        const existingCategory: CategoryDto | null = await prisma.category.findUnique({
            where: {id: product.categoryId},
        });

        if (!existingCategory) {
            throw new Error("La catégorie spécifiée n'existe pas.");
        }

        return await prisma.product.create({
            data: {
                name: product.name ? product.name : 'pas de nom',
                slug: product.slug ? product.slug : 'pas de slug',
                description: product.description?product.description:'pas de descriptions',
                image: product.image ? product.image : 'https://images.openfoodfacts.org/images/products/544/900/013/1805/front_en.602.400.jpg',
                price: product.price ? product.price : 500,
                categoryId: product.categoryId,
                discountId: null,
            },
        });
    } catch (error: any) {
        throw new Error('La création du produit a échoué.');
    }
}

export async function getAllProducts(fields: Prisma.ProductSelect = {}): Promise<ProductDto[]> {
    try {
        if (Object.keys(fields).length === 0) {
            fields = {
                id: true,
                name: true,
                slug: true,
                description: true,
                image: true,
                price: true,
                createdAt: true,
                updatedAt: true,
                categoryId: true,
                discountId: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                discount: {
                    select: {
                        id: true,
                        rate: true,
                    }
                }
            }
        }
            
        return await prisma.product.findMany({
            select: {
                ...fields
            },
            orderBy: {
                name: 'asc',
            },
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
        throw new Error('La récupération des produits a échoué');
    }
}

export async function getImageFromGoogle(name: string): Promise<string> {
    if (!name || typeof name !== 'string') {
        throw new Error('Le paramètre name doit être une chaîne de caractères non vide');
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    const cx = process.env.GOOGLE_CX;

    if (!apiKey || !cx) {
        throw new Error('Les clés API Google (GOOGLE_API_KEY et GOOGLE_CX) sont requises');
    }

    try {
        const encodedQuery = encodeURIComponent(name);
        console.log("====================================");
        console.log(encodedQuery)
        console.log("====================================");
        const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodedQuery}&searchType=image&num=1&imgSize=medium&safe=active&excludeTerms=facebook.com,instagram.com,pinterest.com`;
        console.log('Recherche d\'image pour', name, 'sur Google avec l\'URL', url);
        const response = await fetch(url);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Erreur API Google (${response.status}): ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        console.log("====================================");
        console.log(data)

        if (!data.items || !data.items.length) {
            return '/images/default-image.png';
        }

        const imageUrl = data.items[0].link;
        console.log("====================================");
        console.log('Image trouvée pour', name, ':', imageUrl);

        if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.match(/^https?:\/\/.+/)) {
            return '/images/default-image.png';
        }

        return imageUrl;

    } catch (error) {
        console.error('Erreur lors de la récupération de l\'image :', error);
        return '/images/default-image.png'; // Return default image in case of any error
    }
}

export async function searchProduct(name: string, minScore: number = 0.35): Promise<ProductDto | null> {
    try {
        // Normalisation du nom de l'ingrédient
        const normalizedName = name
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .trim();

        const allProducts = await getAllProducts();

        const fuse = new Fuse(allProducts, fuseOptions);

        const results = fuse.search(normalizedName);

        const filteredResults = results.filter(result => result.score && result.score >= minScore);
        
        console.log(`Recherche pour "${normalizedName}"`, results);
        console.log(results);

        // Retourne le meilleur résultat
        return filteredResults.length > 0 ? filteredResults[0].item : null;
    } catch (error) {
        console.error("Erreur lors de la recherche floue du produit :", error);
        return null;
    }
}

export async function getProductById(id: string): Promise<ProductDto | null> {
    try {
        return await prisma.product.findUnique({
            where: {id},
            include: {category: true, discount: true},
        });
    } catch (error) {
        console.error("Erreur lors de la récupération du produit :", error);
        throw new Error('La récupération du produit a échoué.');
    }
}

export async function getProductBySlug(slug: string): Promise<ProductDto | null> {
    try {
        return await prisma.product.findUnique({
            where: {slug: slug},
            include: {category: true, discount: true},
        });
    } catch (error) {
        console.error("Erreur lors de la récupération du produit :", error);
        throw new Error('La récupération du produit a échoué.');
    }
}

export async function filterProduct(filters: {
    equals?: string | number | boolean | null;
    lte?: number;
    gte?: number;
    lt?: number;
    gt?: number;
    contains?: string;
    startsWith?: string;
    endsWith?: string;
    in?: string[] | number[];
    notIn?: string[] | number[];
}): Promise<ProductDto[]> {
    try {
        let customFilters: any[] = []
        if (filters) {
            customFilters = Object.entries(filters)?.map(([key, value]) => ({
                [key]: value
            }));
        }

        return await prisma.product.findMany({
            where: customFilters.length > 0 ? {AND: customFilters} : {},
            include: {category: true, discount: true}
        });

    } catch (error) {
        console.error("Erreur lors du filtrage des produits :", error);
        throw new Error('Le filtrage des produits a échoué.');
    }
}

export async function changeDiscount(product: ProductDto | null, discount: DiscountDto | null): Promise<ProductDto> {
    if (!product) {
        throw Error('produit non définit')
    }

    const findProduct: Product | null = await prisma.product.findFirst({
        where: {
            id: product.id,
        },
    })

    if (findProduct) {
        return prisma.product.update({
                where: {
                    id: findProduct.id,
                },

                data: {
                    ...findProduct, discountId: discount ? discount.id : null
                },

                include: {
                    discount: true,
                    category: true
                },
            }
        )
    } else {
        throw Error('produit non trouvé')
    }

}