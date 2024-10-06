'use client';

import {useEffect, useState} from "react";
import ProductCard from "./components/ProductCard";
import {ProductDto} from "@/app/interface/product/productDto";
import {getAllProducts} from "@/app/services/products/product";

export default function Home() {

    const [products, setProducts] = useState<ProductDto[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const products: ProductDto[] = await getAllProducts()
            return setProducts(products);
        }
        fetchProducts();
    }, []);


    const bgColors = ['bg-tertiaryColorPink', 'bg-tertiaryColorOrange', 'bg-tertiaryColorBlue', 'bg-tertiaryColorPurple'];
    return (
        <div className="flex w-full bg-primaryBackgroundColor h-[85vh]">
            <section className="grid grid-cols-4 gap-10 px-20 py-10">

                {products.map((product, index) => (
                    <ProductCard key={product.id} product={product} bgColor={bgColors[index % bgColors.length]}/>
                ))}
            </section>
        </div>
    );
}
