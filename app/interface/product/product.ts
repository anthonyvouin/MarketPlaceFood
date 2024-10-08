import { Decimal } from "@prisma/client/runtime/library";

export interface Product {
    id?: string;                
    name: string;              
    slug: string;              
    description: string;        
    image: string;             
    price: Decimal;              
    createdAt?: Date;           
    updatedAt?: Date;          
    categoryId: string  
  }
  
