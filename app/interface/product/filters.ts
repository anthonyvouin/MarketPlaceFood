export interface Filters {
    price?: { gte: number; lte: number };
    categoryId?: { in: string[] };
    discountId?: boolean;
}

export interface PriceRange {
    min: number;
    max: number;
}