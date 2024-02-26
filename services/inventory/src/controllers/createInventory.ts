import { Request, Response, NextFunction } from 'express';
import prisma from '@/prisma';
import { InventoryCreateDTOSchema } from '@/schemas';

const createInventory = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		// Validate request body
		const parsedBody = InventoryCreateDTOSchema.safeParse(req.body);
		if (!parsedBody.success) {
			return res.status(400).json({ error: parsedBody.error.errors });
		}

		// create inventory
		const inventory = await prisma.inventory.create({
			data: {
				...parsedBody.data,
				histories: {
					create: {
						actionType: 'IN',
						quantityChanged: parsedBody.data.quantity,
						lastQuantity: 0,
						newQuantity: parsedBody.data.quantity,
					},
				},
			},
			select: {
				id: true,
				quantity: true,
			},
		});

		return res.status(201).json(inventory);
	} catch (error) {
		next(error);
	}
};

export default createInventory;
