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

export type CreateOrderInput = z.infer<typeof CreateOrderInputSchema>;
export type CreateOrderResponse = z.infer<typeof CreateOrderResponseSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type OrderStatus = Order["status"];
