import { Request, Response, NextFunction } from 'express';
import prisma from '@/prisma';
import { InventoryUpdateDTOSchema } from '@/schemas';

const updateInventory = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		// check if the inventory exists
		const { id } = req.params;
		const inventory = await prisma.inventory.findUnique({
			where: { id },
		});

		if (!inventory) {
			return res.status(404).json({ message: 'Inventory not found' });
		}

		// update the inventory
		const parsedBody = InventoryUpdateDTOSchema.safeParse(req.body);
		if (!parsedBody.success) {
			return res.status(400).json(parsedBody.error.errors);
		}

		// find the last history
		const lastHistory = await prisma.history.findFirst({
			where: { inventoryId: id },
			orderBy: { createdAt: 'desc' },
		});

		// calculate the new quantity
		let newQuantity = inventory.quantity;
		if (parsedBody.data.actionType === 'IN') {
			newQuantity += parsedBody.data.quantity;
		} else if (parsedBody.data.actionType === 'OUT') {
			newQuantity -= parsedBody.data.quantity;
		} else {
			return res.status(400).json({ message: 'Invalid action type' });
		}

		// update the inventory
		const updatedInventory = await prisma.inventory.update({
			where: { id },
			data: {
				quantity: newQuantity,
				histories: {
					create: {
						actionType: parsedBody.data.actionType,
						quantityChanged: parsedBody.data.quantity,
						lastQuantity: lastHistory?.newQuantity || 0,
						newQuantity,
					},
				},
			},
			select: {
				id: true,
				quantity: true,
			},
		});

		return res.status(200).json(updatedInventory);
	} catch (error) {
		next(error);
	}
};

export default updateInventory;
