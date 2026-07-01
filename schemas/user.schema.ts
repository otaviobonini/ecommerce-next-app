import { z } from "zod";

export const UserRoleSchema = z.enum(["USER", "ADMIN"]);

export const UserSchema = z.object({
  userId: z.number(),
  username: z.string(),
  email: z.string().email(),
  role: UserRoleSchema,
  address: z.array(z.any()),
  order: z.array(z.any()),
});

export type User = z.infer<typeof UserSchema>;
