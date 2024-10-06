import classNames from 'classnames';
import Image from 'next/image';
import {PlusIcon} from "@radix-ui/react-icons";
import {ProductCardProps} from '@/app/interface/product/productCardProps';
import {formatPrice} from "@/app/pipe/format";


const ProductCard = ({product, bgColor}: ProductCardProps) => {
    return (
        <div className={classNames(`${bgColor} bg-opacity-25`, 'w-full rounded-lg shadow-md p-4 grid grid-cols-1 grid-rows-[1.5fr,0.5fr,1fr,1fr] h-[28rem] font-manrope')}>
            {/* <div className={classNames(`${bgColor} bg-opacity-25`, 'w-full rounded-lg shadow-md p-4 grid grid-cols-1 grid-rows-[1fr,2fr,1fr,1fr] h-[30rem] font-manrope')}> */}
            {/* { product?.discount &&
        <span className={classNames(`${bgColor} bg-opacity-50`, 'h-max py-2 px-1 rounded-md w-20 flex items-center justify-center')}>
          <p>{Math.round(Math.random() * 10)}</p>
          <p>%</p>
        </span>
  } */}
            <div className="flex justify-center items-start  h-full">
                <Image
                    src="/images/fraise.png"
                    alt={product.name}
                    width={150}
                    height={100}
                    className="object-contain"
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
                <button className={classNames(`${bgColor} bg-opacity-50`, 'text-white h-max p-3 rounded-md items-center justify-center hover:bg-opacity-100')}>
                    <PlusIcon height="16" width="16"/>
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
