import { z } from "zod";

export const CreateOrderInputSchema = z.object({
  addressId: z.number().int().positive(),
});

export const CreateOrderResponseSchema = z.object({
  orderId: z.number(),
  paymentLink: z.string(),
});

export const OrderItemSchema = z.object({
  orderItemId: z.number(),
  orderId: z.number(),
  productId: z.number(),
  quantity: z.number(),
  priceAtTime: z.string(),
});

export const OrderSchema = z.object({
  orderId: z.number(),
  userId: z.number(),
  addressId: z.number(),
  status: z.enum(["PENDING", "PAID", "ONGOING", "DELIVERED", "CANCELLED"]),
  createdAt: z.string(),
  updatedAt: z.string(),
  total: z.string(),
  paymentLink: z.string().nullable(),
  orderItems: z.array(OrderItemSchema),
});

export const OrdersResponseSchema = z.array(OrderSchema);

// GET /orders (admin) devolve um shape diferente do /orders/me e /orders/:orderId:
// sem userId/addressId "soltos", mas com user, address e orderItems[].product aninhados.
export const AdminOrderItemSchema = z.object({
  orderItemId: z.number(),
  orderId: z.number(),
  productId: z.number(),
  quantity: z.number(),
  priceAtTime: z.string(),
  product: z.object({
    productId: z.number(),
    productName: z.string(),
    productPrice: z.string(),
    productDescription: z.string().nullable(),
    stock: z.number(),
    isFeatured: z.boolean(),
    category: z
      .object({
        categoryId: z.number(),
        name: z.string(),
        categoryImage: z.string().nullable(),
      })
      .nullable(),
    images: z.array(
      z.object({
        imageId: z.number(),
        url: z.string(),
        isPrimary: z.boolean(),
      }),
    ),
  }),
});

export const AdminOrderSchema = z.object({
  orderId: z.number(),
  status: z.enum(["PENDING", "PAID", "ONGOING", "DELIVERED", "CANCELLED"]),
  total: z.string(),
  paymentLink: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  user: z.object({
    userId: z.number(),
    username: z.string(),
    email: z.string(),
  }),
  address: z.object({
    addressId: z.number(),
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    isDefault: z.boolean(),
  }),
  orderItems: z.array(AdminOrderItemSchema),
});

export const AdminOrdersResponseSchema = z.array(AdminOrderSchema);

export type CreateOrderInput = z.infer<typeof CreateOrderInputSchema>;
export type CreateOrderResponse = z.infer<typeof CreateOrderResponseSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type OrderStatus = Order["status"];
export type AdminOrderItem = z.infer<typeof AdminOrderItemSchema>;
export type AdminOrder = z.infer<typeof AdminOrderSchema>;
