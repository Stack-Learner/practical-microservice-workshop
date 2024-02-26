import { CART_TTL, INVENTORY_SERVICE } from '@/config';
import redis from '@/redis';
import { CartItemSchema } from '@/schemas';
import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuid } from 'uuid';

const addToCart = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// validate request body
		const parsedBody = CartItemSchema.safeParse(req.body);
		if (!parsedBody.success) {
			return res.status(400).json({ errors: parsedBody.error.errors });
		}

		let cartSessionId = (req.headers['x-cart-session-id'] as string) || null;

		// check if cart session id is present in the request header and exists in the store
		if (cartSessionId) {
			const exists = await redis.exists(`sessions:${cartSessionId}`);
			console.log('Session Exists: ', exists);

			if (!exists) {
				cartSessionId = null;
			}
		}

		// if cart session id is not present, create a new one
		if (cartSessionId === null) {
			cartSessionId = uuid();
			console.log('New Session ID: ', cartSessionId);

			// set the cart session id in the redis store
			await redis.setex(`sessions:${cartSessionId}`, CART_TTL, cartSessionId);

			// set the cart session id in the response header
			res.setHeader('x-cart-session-id', cartSessionId);
		}

		// check if the inventory is available
		const { data } = await axios.get(
			`${INVENTORY_SERVICE}/inventories/${parsedBody.data.inventoryId}`
		);
		if (Number(data.quantity) < parsedBody.data.quantity) {
			return res.status(400).json({ message: 'Inventory not available' });
		}

		// add item to the cart
		// TODO: Check if the product already exists in the cart
		// Logic: parsedBody.data.quantity - existingQuantity
		await redis.hset(
			`cart:${cartSessionId}`,
			parsedBody.data.productId,
			JSON.stringify({
				inventoryId: parsedBody.data.inventoryId,
				quantity: parsedBody.data.quantity,
			})
		);

		// update inventory
		await axios.put(
			`${INVENTORY_SERVICE}/inventories/${parsedBody.data.inventoryId}`,
			{
				quantity: parsedBody.data.quantity,
				actionType: 'OUT',
			}
		);

		return res
			.status(200)
			.json({ message: 'Item added to cart', cartSessionId });
	} catch (error) {
		next(error);
	}
};

export default addToCart;
