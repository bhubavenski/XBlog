import { z } from 'zod';

export const SignInFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  rememberMe: z.preprocess(
    (val) => (val === 'true' ? true : false),
    z.boolean().default(false)
  ),
});

export type SignInFormSchemaValues = z.infer<typeof SignInFormSchema>;
