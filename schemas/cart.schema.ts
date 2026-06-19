import { z } from "zod";

// ---------------------------------------------------------------------------
// INPUTS — espelham os schemas de validação da API (src/schemas/cart.schema.ts)
// ---------------------------------------------------------------------------

export const CreateCartItemInputSchema = z.object({
  cartId: z.number().int().positive(),
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

export const UpdateCartItemQuantityInputSchema = z.object({
  quantity: z.number().int().positive(),
});

// ---------------------------------------------------------------------------
// RESPOSTAS — espelham o Prisma schema + o que cada rota do CartController
// de fato devolve. Importante: productPrice é Decimal no Prisma, que serializa
// como STRING no JSON — mesmo padrão já usado em schemas/types/product.ts.
// ---------------------------------------------------------------------------

// GET /products já tem esse shape em outro lugar do projeto (types/product.ts).
// Repetido aqui em miniatura (só o necessário pro carrinho) pra não criar
// dependência cruzada entre schemas de domínios diferentes.
const ProductImageSchema = z.object({
  imageId: z.number(),
  productId: z.number(),
  url: z.string(),
  isPrimary: z.boolean(),
});

const ProductSchema = z.object({
  productId: z.number(),
  productName: z.string(),
  productPrice: z.string(), // Decimal -> string no JSON
  productDescription: z.string().nullable(),
  stock: z.number(),
  isFeatured: z.boolean(),
  categoryId: z.number().nullable(),
  images: z.array(ProductImageSchema),
});

// POST /carts, GET /carts -> Cart (SEM items; findCartByUserId não faz include)
export const CartSchema = z.object({
  cartId: z.number(),
  userId: z.number(),
  createdAt: z.string(), // DateTime -> string ISO no JSON
  updatedAt: z.string(),
});

// POST /carts/items -> CartItem cru (upsertCartItem não inclui o produto)
export const CartItemSchema = z.object({
  cartItemId: z.number(),
  cartId: z.number(),
  productId: z.number(),
  quantity: z.number(),
});

// GET /carts/:cartId/items -> CartItem[] COM product aninhado (getCartItems faz include)
export const CartItemWithProductSchema = CartItemSchema.extend({
  product: ProductSchema,
});

export const CartItemsResponseSchema = z.array(CartItemWithProductSchema);

// PATCH /carts/items/:cartItemId -> CartItem cru (updateCartItemQuantity sem include)
export const UpdateCartItemResponseSchema = CartItemSchema;

// ---------------------------------------------------------------------------
// TIPOS
// ---------------------------------------------------------------------------

export type CreateCartItemInput = z.infer<typeof CreateCartItemInputSchema>;
export type UpdateCartItemQuantityInput = z.infer<
  typeof UpdateCartItemQuantityInputSchema
>;

export type Cart = z.infer<typeof CartSchema>;
export type CartItem = z.infer<typeof CartItemSchema>;
export type CartItemWithProduct = z.infer<typeof CartItemWithProductSchema>;
