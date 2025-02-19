import { CartInputSchema } from "../validators/cart.validator"
import { OrderItemInputSchema } from "../validators/orderitem.validator"
import { ProductInputSchema } from "../validators/product.validator"
import { UserInputSchema, UserSignInSchema, UserSignUpSchema } from "../validators/user.validator";

import { z } from "zod"

export type IProductInput = z.infer<typeof ProductInputSchema>
export type IOrderItemInput = z.infer<typeof OrderItemInputSchema>
export type ICartInput = z.infer<typeof CartInputSchema>
export type IUserInput = z.infer<typeof UserInputSchema>;
export type IUserSignIn = z.infer<typeof UserSignInSchema>;
export type IUserSignUp = z.infer<typeof UserSignUpSchema>;
