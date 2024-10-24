'use client';

import {useEffect, useState} from 'react';
import {filterProduct} from '../services/products/product';
import ProductCard from '../components/ProductCard';
import {Slider} from '@radix-ui/themes';
import * as Checkbox from '@radix-ui/react-checkbox';
import {CheckIcon} from '@radix-ui/react-icons';
import {getAllCategories} from '../services/category/category';
import {ProductDto} from '../interface/product/productDto';
import {CategoryDto} from '../interface/category/categoryDto';
import {getPageName} from "@/app/utils/utils";

export default function Products() {
    const [products, setProducts] = useState<ProductDto[]>([]);
    const [filters, setFilters] = useState<{ [key in keyof ProductDto]?: any }>({});
    const [priceRange, setPriceRange] = useState([0, 50]);
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const bgColors = ['bg-tertiaryColorPink', 'bg-tertiaryColorOrange', 'bg-tertiaryColorBlue', 'bg-tertiaryColorPurple'];

    const fetchProducts = async (filters: any): Promise<void> => {
        try {
            const filteredProducts: ProductDto[] = await filterProduct(filters);
            setCategories(await getAllCategories());
            setProducts(filteredProducts);
        } catch (error) {
            console.error("Erreur lors de la récupération des produits :", error);
        }
    };

    useEffect((): void => {
        if (selectedCategories.length > 0) {
            handleFilterChange('categoryId', {in: selectedCategories});
        } else {
            handleFilterChange('categoryId', undefined); // Si aucune catégorie sélectionnée, pas de filtre sur la catégorie
        }
    }, [selectedCategories]);

    useEffect((): void => {
        fetchProducts(filters);
    }, [filters]);

    useEffect((): void => {
        getPageName();
    }, []);

    const handleFilterChange = (key: keyof ProductDto, value: any): void => {
        setFilters(prev => ({...prev, [key]: value}));
    };

    const handlePriceChange = (value: number[]): void => {
        setPriceRange(value);
        handleFilterChange('price', {gte: value[0], lte: value[1]});
    };

    const handleCategoryChange = (categoryId: string): void => {
        if (selectedCategories.includes(categoryId)) {
            setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
        } else {
            setSelectedCategories([...selectedCategories, categoryId]);
        }
    };

    return (
        <section className="px-20 py-10 w-full">
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Filtres</h2>
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Prix</h3>
                    {priceRange[0]} - {priceRange[1]} €
                    <Slider
                        defaultValue={[0, 50]}
                        min={0}
                        max={50}
                        step={1}
                        value={priceRange}
                        onValueChange={handlePriceChange}
                    />

                    <div className="flex justify-between mt-2">
                        <span>0 €</span>
                        <span>50 €</span>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Catégories</h3>
                    <div>
                        {categories.map(category => (
                            <div key={category.id} className="flex items-center space-x-2 mt-2">
                                <Checkbox.Root
                                    id={category.id}
                                    checked={selectedCategories.includes(category.id!)} // Vérifie si la catégorie est sélectionnée
                                    onCheckedChange={() => handleCategoryChange(category.id!)}
                                    className="w-5 h-5 bg-gray-200 rounded">
                                    <Checkbox.Indicator>
                                        <CheckIcon className="text-blue-500 w-4 h-4"/>
                                    </Checkbox.Indicator>
                                </Checkbox.Root>
                                <label htmlFor={category.id} className="text-sm">{category.name}</label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-10">
                {products.map((product: ProductDto, index) => (
                    <>
                        <ProductCard
                            productSlug={product.slug}
                            key={product.id}
                            product={product}
                            bgColor={bgColors[index % bgColors.length]}
                        />
                    </>
                ))}
            </div>
        </section>
    );
}
