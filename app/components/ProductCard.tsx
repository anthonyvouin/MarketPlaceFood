import Image from 'next/image';
import { ProductCardProps } from '@/app/interface/product/productCardProps';
import { formatPrice } from "@/app/pipe/format";
import Link from 'next/link';

const ProductCard = ({ product, bgColor, productSlug }: ProductCardProps) => {
    return (
        <Link href={`/products/${productSlug}`} className={`${bgColor} bg-opacity-25 w-full rounded-lg shadow-md p-4 grid grid-cols-1 grid-rows-[1.5fr,0.5fr,1fr,1fr] h-[28rem] font-manrope`}>
            <div className="flex justify-center items-start h-full">
                <Image
                    src={product?.image ? product?.image : "/images/default-image.png"}
                    alt={product.name}
                    width={150}
                    height={150}
                    className="object-contain max-w-[150px] max-h-32"
                />
            </div>
            <p className="text-lg font-bold ">{product.name}</p>
            <p className="text-black items-start">
                {product?.description?.length > 50
                    ? `${product?.description?.substring(0, 50)}...`
                    : product?.description}
            </p>
            <div className="flex justify-between items-center">
                <p className="text-black font-bold text-xl">{formatPrice(product?.price)} €</p>
                <button className={`${bgColor} bg-opacity-50 text-white h-max p-3 rounded-md items-center justify-center hover:bg-opacity-100`}>
                 <span className="pi pi-plus"></span>
                </button>
            </div>
        </Link>
    );
};

export default ProductCard;
