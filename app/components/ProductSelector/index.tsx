import { useEffect, useState } from "react";
import { getAllProductsVisible } from "@/app/services/products/product";
import { ProductDto } from "@/app/interface/product/productDto";
import Image from "next/image";

interface ProductSelectorProps {
  onSelect: (product: ProductDto) => void;
  onClose: () => void;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({ onSelect, onClose }) => {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getAllProductsVisible();
        setProducts(products);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 relative h-[80vh] overflow-auto">
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Sélectionner un produit</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition-colors">
            <i className="pi pi-times text-xl"></i>
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Chargement des produits...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => onSelect(product)}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-primaryColor group"
              >
                <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <Image
                    src={product.image || "/images/default-image.png"}
                    alt={product.name}
                    width={500}
                    height={500}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primaryColor">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500">{product.description || "Aucune description"}</p>
              </div>
            ))}
          </div>
        )}

        {/* Bouton Fermer */}
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSelector;