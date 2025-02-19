import { z } from "zod";
import { OrderItemInputSchema } from "./orderitem.validator";

export const CartInputSchema = z.object({
    items: z
      .array(OrderItemInputSchema)
      .min(1, 'Order must contain at least one item'),
    itemsPrice: z.number(),
  
    taxPrice: z.optional(z.number()),
    shippingPrice: z.optional(z.number()),
    totalPrice: z.number(),
    paymentMethod: z.optional(z.string()),
    deliveryDateIndex: z.optional(z.number()),
    expectedDeliveryDate: z.optional(z.date()),
  })