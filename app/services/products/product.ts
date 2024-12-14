"use server"

import Fuse from 'fuse.js';
import {Prisma, PrismaClient, Product} from '@prisma/client';
import {ProductDto} from '@/app/interface/product/productDto';
import {CategoryDto} from "@/app/interface/category/categoryDto";
import {DiscountDto} from "@/app/interface/discount/discountDto";

const prisma = new PrismaClient();

const fuseOptions = {
    includeScore: true,
    threshold: 0.3,
    keys: ['name'],
    minMatchCharLength: 3,
    findAllMatches: true,
    shouldSort: false,
    ignoreLocation: true, // si false, plus c'est au début du mot, plus le score est élevé
    ignoreFieldNorm: true, // si true, plus le mot est long, plus le score est élevé
    includeMatches: false,
};

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
                description: product.description ? product.description : 'pas de descriptions',
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
                visible: true,
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
        throw new Error('La récupération des produits a échoué');
    }
}

export async function getAllProductsVisible(): Promise<ProductDto[]> {
    try {
        return await prisma.product.findMany({
            where: {
                visible: true
            },

            orderBy: {
                name: 'asc',
            },
            include: {
                category: true,
                discount: true,
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
        const encodedQuery = encodeURIComponent(`${name} elegant presentation recipe professional dish`);
        const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodedQuery}&searchType=image&num=5&imgSize=large&safe=active&excludeTerms=facebook.com,instagram.com,pinterest.com`;

        const response = await fetch(url);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Erreur API Google (${response.status}): ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();

        if (!data.items || !data.items.length) {
            console.warn('Aucune image trouvée, utilisation de l\'image par défaut.');
            return '/images/default-image.png';
        }

        for (const item of data.items) {
            // const isImageLargeEnough = item.image?.width >= 800 && item.image?.height >= 600; // Taille minimale
            if (item.link && item.link.match(/^https?:\/\/.+/)) {
                return item.link;
            }
        }

        console.warn('Aucune image pertinente trouvée, utilisation de l\'image par défaut.');
        return '/images/default-image.png';

    } catch (error) {
        console.error('Erreur lors de la récupération de l\'image :', error);
        return '/images/default-image.png';
    }
}


export async function getImageFromUnsplash(query: string): Promise<string> {
    const unsplash_api_url = process.env.UNSPLASH_API_URL;
    const unsplash_access_key = process.env.UNSPLASH_ACCESS_KEY;
    if (!query) {
        throw new Error('Le paramètre query doit être une chaîne de caractères non vide.');
    }

    const url = `${unsplash_api_url}/search/photos?query=${encodeURIComponent(query)}&per_page=1&client_id=${unsplash_access_key}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erreur API Unsplash (${response.status}): ${response.statusText}`);
        }

        const data = await response.json();
        if (data.results && data.results.length > 0) {
            return data.results[0].urls.regular; // URL de l'image
        } else {
            return '/images/default-image.png'; // Image par défaut
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'image depuis Unsplash :', error);
        return '/images/default-image.png';
    }
}

export async function getImageFromPixabay(name: string): Promise<string> {
    if (!name || typeof name !== 'string') {
        throw new Error('Le paramètre name doit être une chaîne de caractères non vide');
    }

    const apiKey = process.env.PIXABAY_API_KEY;
    console.log(apiKey);

    if (!apiKey) {
        throw new Error('La clé API Pixabay (PIXABAY_API_KEY) est requise');
    }

    try {
        const encodedQuery = encodeURIComponent(`${name} food recipe elegant dish`);
        const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodedQuery}&image_type=photo&category=food&per_page=5&min_width=800&min_height=600&safesearch=true`;

        const response = await fetch(url);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Erreur API Pixabay (${response.status}): ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();

        if (!data.hits || !data.hits.length) {
            console.warn('Aucune image trouvée, utilisation de l\'image par défaut.');
            return '/images/default-image.png';
        }

        for (const hit of data.hits) {
            if (hit.webformatURL && hit.webformatURL.match(/^https?:\/\/.+/)) {
                return hit.webformatURL;
            }
        }

        console.warn('Aucune image pertinente trouvée, utilisation de l\'image par défaut.');
        return '/images/default-image.png';

    } catch (error) {
        console.error('Erreur lors de la récupération de l\'image Pixabay :', error);
        return '/images/default-image.png';
    }
}

export async function searchProduct(name: string, minScore: number = 0.36): Promise<ProductDto | null> {
    try {
        const allProducts = await getAllProducts();

        const fuse = new Fuse(allProducts, fuseOptions);

        const results = fuse.search(name);

        const filteredResults = results.filter(result => result.score && result.score <= minScore);
        if (filteredResults.length === 0) {
            return null;
        }

        return filteredResults[0].item;
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
            where: {slug: slug, visible: true},
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
            where: {
                AND: [
                    {visible: true},
                    ...(customFilters.length > 0 ? customFilters : []),

                ],
            },
            include: {category: true, discount: true},
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

export async function toggleProductVisibility(productId: string, visible: boolean): Promise<void> {
    try {


        const product: Product | null = await prisma.product.findUnique({where: {id: productId}});

        if (!product) {
            throw new Error('Le produit n\'existe pas.');
        }
        await prisma.product.update({
            where: {id: productId},
            data: {visible: visible},
        });
    } catch (error) {
        console.error("Erreur lors du changement de visibilité du produit :", error);
        throw new Error('Le changement de visibilité du produit a échoué.');
    }
}