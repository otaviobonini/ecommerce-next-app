import { z } from "zod";

export interface ProductImage {
  imageId: number;
  productId: number;
  url: string;
  isPrimary: boolean;
}

export interface Product {
  productId: number;
  productName: string;
  productPrice: string; // Decimal vira string no JSON
  productDescription: string | null;
  stock: number;
  isFeatured: boolean;
  categoryId: number | null;
  images: ProductImage[];
}

export interface ProductsResponse {
  products: Product[];
  limit: number;
  offset: number;
  total: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

// A API retorna Category[] diretamente — sem envelope { categories: [...] }
// CategoryResponse foi removida pois não reflete o contrato real da API
export interface Category {
  categoryId: number;
  name: string;
  categoryImage: string | null;
}

export const EditProductSchema = z.object({
  productName: z.string().optional(),
  productPrice: z.coerce.number().positive().optional(),
  productDescription: z.string().optional(),
  stock: z.coerce.number().int().min(0).optional(),
  isFeatured: z.boolean().optional(),
  categoryId: z.coerce.number().int().positive().optional().nullable(),
});

export type EditProductData = z.infer<typeof EditProductSchema>;
