import { ProductInputSchema } from "../validators/product.validator"
import { z } from "zod"

export type IProductInput = z.infer<typeof ProductInputSchema>
