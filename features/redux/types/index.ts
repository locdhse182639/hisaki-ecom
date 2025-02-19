import { UserInputSchema, UserSignInSchema, UserSignUpSchema } from "@/lib/validator";
import { z } from "zod";

export type IUserInput = z.infer<typeof UserInputSchema>
export type IUserSignIn = z.infer<typeof UserSignInSchema>
export type IUserSignUp = z.infer<typeof UserSignUpSchema>
