
import { z } from 'zod';

export const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string()
    .min(4, "Email must be between 3 to 32 characters")
    .max(2000)
    .email("Invalid email"),
  password: z.string()
    .min(6, "Password must contain at least 6 characters")
    .regex(/\d/, "Password must contain a number"),
});
