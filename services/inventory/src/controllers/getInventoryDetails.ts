import prisma from '@/prisma';
import { Request, Response, NextFunction } from 'express';

const getInventoryDetails = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const inventory = await prisma.inventory.findUnique({
			where: { id },
			include: {
				histories: {
					orderBy: {
						createdAt: 'desc',
					},
				},
			},
		});

		if (!inventory) {
			return res.status(404).json({ message: 'Inventory not found' });
		}

		return res.status(200).json(inventory);
	} catch (err) {
		next(err);
	}
};

export default getInventoryDetails;
