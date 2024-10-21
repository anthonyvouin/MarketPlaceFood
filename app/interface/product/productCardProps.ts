import {ProductDto} from "@/app/interface/product/productDto";

export interface ProductCardProps {
    product: ProductDto;
    bgColor: string;
    productSlug: string;
  }