import Image from 'next/image';
import {ProductCardProps} from '@/app/interface/product/productCardProps';
import {formatPrice} from "@/app/pipe/format";
import Link from 'next/link';
import {useSideBarBasket} from "@/app/provider/sideBar-basket-provider";


const ProductCard = ({product, bgColor, productSlug}: ProductCardProps) => {
    const {addProduct} = useSideBarBasket();
    return (
        <div className={`${bgColor} bg-opacity-25 w-full rounded-lg shadow-md p-4   font-manrope`}>
            <Link href={`/products/${productSlug}`}>
                <div className="grid grid-cols-1 grid-rows-[1.5fr,0.5fr,1fr,1fr] h-[25rem]">
                    <div className="flex justify-center items-start h-full">
                        <Image
                            src={product?.image ? product?.image : "/images/default-image.png"}
                            alt={product.name}
                            width={150}
                            height={150}
                            className="object-contain max-w-[150px] max-h-32"
                        />
                    </div>
                    <p className="text-lg font-bold mt-2.5">{product.name}</p>
                    <p className="text-black items-start">
                        {product?.description?.length > 50
                            ? `${product?.description?.substring(0, 50)}...`
                            : product?.description}
                    </p>
                </div>

            </Link>
            <div className="flex justify-between items-center">
                <p className="text-black font-bold text-xl">{formatPrice(product?.price)} €</p>
                <button className={`${bgColor} bg-opacity-50 text-white h-max p-3 rounded-md items-center justify-center hover:bg-opacity-100`}
                        onClick={() => addProduct(product, 1)}>
                    <span className="pi pi-plus"></span>
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
