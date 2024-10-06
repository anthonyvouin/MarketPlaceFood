'use client';

import { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import { getProducts } from "./services/products/product";
import { Product } from "./interface/product/product";

export default function Home() {

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await getProducts()
      return setProducts(products);
    }
    fetchProducts();
  },[]);


  const bgColors = ['bg-tertiaryColorPink', 'bg-tertiaryColorOrange', 'bg-tertiaryColorBlue', 'bg-tertiaryColorPurple'];
  return (
    <div className="flex w-full bg-primaryBackgroundColor min-h-[85vh]">
      <section className="grid grid-cols-4 gap-10 px-20 py-10 w-full">

        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} bgColor={bgColors[index % bgColors.length]} />
        ))}
      </section>
    </div>
  );
}
