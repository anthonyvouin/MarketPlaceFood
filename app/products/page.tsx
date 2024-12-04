'use client';

import {useEffect, useState} from 'react';
import {filterProduct} from '../services/products/product';
import ProductCard from '../components/ProductCard/ProductCard';
import {getAllCategories} from '../services/category/category';
import {ProductDto} from '../interface/product/productDto';
import {CategoryDto} from '../interface/category/categoryDto';
import {getPageName} from "@/app/utils/utils";
import {Slider, SliderChangeEvent} from "primereact/slider";
import {Checkbox} from 'primereact/checkbox';

export default function Products() {
    const [products, setProducts] = useState<ProductDto[]>([]);
    const [filteredProducts, setfilteredProducts] = useState<ProductDto[]>([]);
    const [filters, setFilters] = useState<{ [key in keyof ProductDto]?: any }>({});
    const [priceRange, setPriceRange] = useState<number | [number, number]>([0, 50]);
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const bgColors: string[] = ['bg-tertiaryColorPink', 'bg-tertiaryColorOrange', 'bg-tertiaryColorBlue', 'bg-tertiaryColorPurple'];

    const fetchProducts = async (filters: any): Promise<void> => {
        try {
            const filteredProducts: ProductDto[] = await filterProduct(filters);
            setCategories(await getAllCategories());
            setProducts(filteredProducts);
            setfilteredProducts(filteredProducts);
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
        handleFilterChange('price', {gte: priceRange[0], lte: priceRange[1]});
    }, [priceRange, selectedCategories]);

    useEffect((): void => {
        fetchProducts(filters);
        getPageName();
    }, []);

    const handleFilterChange = (key: keyof ProductDto, value: any): void => {
        setfilteredProducts(products.filter((element => element.price >= priceRange[0] * 100 && element.price <= priceRange[1] * 100 && (selectedCategories.length === 0 || selectedCategories.includes(element.categoryId)))))
    };

    const handlePriceChange = async (value: SliderChangeEvent): Promise<void> => {
        setPriceRange(value.value);
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
                    <Slider value={priceRange}
                            onChange={(e: SliderChangeEvent) => handlePriceChange(e)}
                            range
                            min={0}
                            max={50}
                            step={1}
                            pt={{
                                handle: {className: 'bg-actionColor'},
                                range: {className: 'bg-actionColor'}
                            }}
                    />
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Catégories</h3>
                    <div>
                        {categories.map(category => (
                            <div key={category.id} className="flex items-center space-x-2 mt-2">
                                <Checkbox
                                    inputId={category.id}
                                    name={category.name}
                                    value={category.id}
                                    onChange={() => handleCategoryChange(category.id!)}
                                    checked={selectedCategories.includes(category.id!)}

                                />
                                <label htmlFor={category.id} className="text-sm">{category.name}</label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-10">
                {filteredProducts.map((product: ProductDto, index: number) => (
                    <ProductCard
                        productSlug={product.slug}
                        key={product.id}
                        product={product}
                        bgColor={bgColors[index % bgColors.length]}
                    />
                ))}
            </div>
        </section>
    );
}
