import { z } from 'zod';

export const CartItemSchema = z.object({
	productId: z.string(),
	inventoryId: z.string(),
	quantity: z.number(),
});
