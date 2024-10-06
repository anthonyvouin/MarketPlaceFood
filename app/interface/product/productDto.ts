import {CategoryDto} from "@/app/interface/category/categoryDto";
import Decimal = Prisma.Decimal;
import {Prisma} from "@prisma/client";

export interface ProductDto {
    id?: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    price: number | Decimal;
    createdAt?: Date;
    updatedAt?: Date;
    categoryId: string
    category?: CategoryDto
}
  
