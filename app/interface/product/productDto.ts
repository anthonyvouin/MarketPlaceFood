import {CategoryDto} from "@/app/interface/category/categoryDto";
import {DiscountDto} from "@/app/interface/discount/discountDto";

export interface ProductDto {
    id?: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    price: number;
    createdAt?: Date;
    updatedAt?: Date;
    categoryId: string;
    category?: CategoryDto;
    discountId: string | null;
    discount?: DiscountDto | null;
    visible?: boolean | null;
}
  
