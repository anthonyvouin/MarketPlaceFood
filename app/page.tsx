'use client';

import { useEffect, useState } from 'react';
import { ProductDto } from '@/app/interface/product/productDto';
import { getPageName } from '@/app/utils/utils';
import { getAllProductDiscount, getAllProductHighlighting } from './services/products/product';
import ProductCard from './components/ProductCard/ProductCard';
import { Button } from 'primereact/button';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAppleWhole, faCarrot, faLemon, faPepperHot, faLeaf } from '@fortawesome/free-solid-svg-icons';
import { useSession } from 'next-auth/react';

library.add(faAppleWhole, faCarrot, faLemon, faPepperHot, faLeaf);

export default function Home() {
  const [productsHighlighting, setProductsHighlighting] = useState<ProductDto[]>([]);
  const [productsDiscount, setProductsDiscount] = useState<ProductDto[]>([]);

  useEffect((): void => {
    const fetchProducts = async (): Promise<void> => {
      const [highlighting, discount] = await Promise.all([
        getAllProductHighlighting(),
        getAllProductDiscount()
      ]);
      setProductsHighlighting(highlighting);
      setProductsDiscount(discount);
    };
    getPageName();
    fetchProducts();
  }, []);

  const bgColors: string[] = ['bg-tertiaryColorPink', 'bg-tertiaryColorOrange', 'bg-tertiaryColorBlue', 'bg-tertiaryColorPurple'];

  const [iconsReady, setIconsReady] = useState(false);

  const icons = [faAppleWhole, faCarrot, faLemon, faPepperHot, faLeaf];
  const colors = [
    'text-green-500',
    'text-orange-400',
    'text-yellow-400',
    'text-red-500',
    'text-green-400'
  ];

  const fixedPositions = [
    { left: '5%', top: '5%' },
    { left: '20%', top: '10%' },
    { left: '35%', top: '15%' },
    { left: '50%', top: '5%' },
    { left: '77%', top: '10%' },
    { left: '97%', top: '5%' },
    { left: '4%', top: '30%' },
    { left: '25%', top: '25%' },
    { left: '40%', top: '35%' },
    { left: '55%', top: '25%' },
    { left: '70%', top: '30%' },
    { left: '85%', top: '25%' },
    { left: '15%', top: '50%' },
    { left: '30%', top: '45%' },
    { left: '45%', top: '55%' },
    { left: '60%', top: '50%' },
    { left: '75%', top: '45%' },
    { left: '95%', top: '50%' },
    { left: '2%', top: '70%' },
    { left: '20%', top: '65%' },
    { left: '35%', top: '75%' },
    { left: '50%', top: '65%' },
    { left: '65%', top: '70%' },
    { left: '90%', top: '75%' },
    { left: '10%', top: '90%' },
    { left: '25%', top: '85%' },
    { left: '40%', top: '95%' },
    { left: '55%', top: '85%' },
    { left: '70%', top: '90%' },
    { left: '85%', top: '95%' }
  ];

  const decorativeIcons = fixedPositions.map((position, index) => ({
    icon: icons[index % icons.length],
    className: `${colors[index % colors.length]} opacity-0 transition-all transform scale-50`,
    readyClassName: `opacity-40 scale-100 animate-float`,
    style: {
      position: 'absolute',
      left: position.left,
      top: position.top,
      transform: `rotate(${Math.random() * 360}deg)`,
      fontSize: `${1 + Math.random()}rem`,
      animationDelay: `${Math.random() * 2}s`
    }
  }));

  useEffect(() => {
    setIconsReady(true);
  }, []);

  return (
    <div className="w-full bg-primaryBackgroundColor min-h-screen h-screen">
      <section className="h-full relative overflow-hidden w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-green-100/50"/>

        <div className="absolute w-full h-full">
          {decorativeIcons.map((item, index) => (
            <FontAwesomeIcon
              key={index}
              icon={item.icon}
              className={`transition-all duration-500 ${item.className} ${iconsReady ? item.readyClassName : ''}`}
              style={item.style as React.CSSProperties}
            />
          ))}
        </div>

        <div className="relative h-full container mx-auto px-4">
          <div className="h-full flex flex-col justify-center items-center gap-12">
            <div className="md:w-[55rem] h-[27rem] items-center justify-center text-center flex flex-col gap-10 bg-white/50 backdrop-blur-sm p-8 rounded-lg shadow-lg">
              <h1 className="font-manrope font-extrabold text-2xl md:text-3xl text-indigo-800 animate-fade-in">
                Besoin de faire vos courses ? 🤖
              </h1>
              <div className="space-y-4">
                <h2 className="font-manrope font-bold text-xl md:text-xl text-primaryColor">
                  Grâce à Snap&Shop, votre frigo a enfin de bonnes idées.
                </h2>
                <p className="font-manrope text-lg text-primaryColor/80">
                  Simplifiez vos courses, sublimez vos repas.
                </p>
              </div>

              <div className="flex flex-wrap gap-6 justify-center">
                <Button
                  icon="pi pi-shopping-cart"
                  className="font-manrope bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white px-6 py-3 text-lg font-bold rounded-full shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                  label="Pas d'idées ? 🤔"
                />
                <Button
                  icon="pi pi-eye"
                  className="font-manrope bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-6 py-3 text-lg font-bold rounded-full shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                  label="Nos promotions ✨"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {productsHighlighting.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="mb-10">
            <h2 className="font-manrope font-bold text-3xl text-gray-900">
              Nos produits phare
            </h2>
            <div className="h-1 w-24 bg-indigo-600 mt-4 rounded-full"/>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {productsHighlighting.map((product, index) => (
              <ProductCard
                key={product.id}
                productSlug={product.slug}
                product={product}
                bgColor={bgColors[index % bgColors.length]}
              />
            ))}
          </div>
        </section>
      )}

      {productsDiscount.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="mb-10">
            <h2 className="font-manrope font-bold text-3xl text-gray-900">
              Nos produits en promotions
            </h2>
            <div className="h-1 w-24 bg-orange-500 mt-4 rounded-full"/>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {productsDiscount.map((product, index) => (
              <ProductCard
                key={product.id}
                productSlug={product.slug}
                product={product}
                bgColor={bgColors[index % bgColors.length]}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
