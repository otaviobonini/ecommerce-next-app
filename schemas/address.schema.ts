import { z } from "zod";

export const CreateAddressInputSchema = z.object({
  street: z.string().max(255),
  city: z.string().max(100),
  state: z.string().max(100),
  zipCode: z.string().max(20),
  isDefault: z.boolean().default(false),
});

export const EditAddressInputSchema = CreateAddressInputSchema.partial();

export const AddressSchema = z.object({
  addressId: z.number(),
  userId: z.number(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  isDefault: z.boolean(),
});

export const AddressesResponseSchema = z.array(AddressSchema);

export type CreateAddressInput = z.infer<typeof CreateAddressInputSchema>;
export type EditAddressInput = z.infer<typeof EditAddressInputSchema>;
export type Address = z.infer<typeof AddressSchema>;
