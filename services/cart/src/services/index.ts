import { INVENTORY_SERVICE } from '@/config';
import redis from '@/redis';
import axios from 'axios';

export const clearCart = async (id: string) => {
	try {
		const data = await redis.hgetall(`cart:${id}`);
		if (Object.keys(data).length === 0) {
			return;
		}

		const items = Object.keys(data).map((key) => {
			const { quantity, inventoryId } = JSON.parse(data[key]) as {
				inventoryId: string;
				quantity: number;
			};
			return {
				inventoryId,
				quantity,
				productId: key,
			};
		});

		// update inventory
		const requests = items.map((item) => {
			return axios.put(`${INVENTORY_SERVICE}/inventories/${item.inventoryId}`, {
				quantity: item.quantity,
				actionType: 'IN',
			});
		});

		Promise.all(requests);
		console.log('Inventory updated');

		// clear the cart
		await redis.del(`cart:${id}`);
	} catch (error) {
		console.log(error);
	}
};
