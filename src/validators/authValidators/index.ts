import { z, ZodSchema } from "zod";

export const signupSchema: ZodSchema<{
  email: string;
  password: string;
}> = z.object({
  email: z.string().email("Invalid email format").max(255),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100),
});

export const loginSchema: ZodSchema<{
  email: string;
  password: string;
  deviceToken: string;
}> = z.object({
  email: z.string().email("Invalid email format").max(255),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100),
  deviceToken: z.string(),
});

export const otpVerifySchema: ZodSchema<{
  userId: string;
  otp: string;
}> = z.object({
  userId: z.string(),
  otp: z.string(),
});
export const otpSendSchema: ZodSchema<{
  email: string;
}> = z.object({
  email: z.string().email("Invalid email format").max(255),
});

export const createProfileSchema: ZodSchema<{
  name: string;
  age?: number;
  gender: string;
}> = z
  .object({
    name: z.string().max(255),
    gender: z.string(),
    age: z.number().optional(),
  })
  .refine(
    (data) =>
      data.gender !== "female" ||
      (data.gender === "female" && data.age !== undefined),
    {
      message: "Age is required unless gender is female",
      path: ["age"],
    }
  );
