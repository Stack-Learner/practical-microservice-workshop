import prisma from '@/prisma';
import { ProductUpdateDTOSchema } from '@/schemas';
import { Request, Response, NextFunction } from 'express';

const updateProduct = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		// verify if the request body is valid
		const parsedBody = ProductUpdateDTOSchema.safeParse(req.body);
		if (!parsedBody.success) {
			return res.status(400).json({ errors: parsedBody.error.errors });
		}

		// check if the product exists
		const product = await prisma.product.findUnique({
			where: {
				id: req.params.id,
			},
		});

		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}

		// update the product
		const updatedProduct = await prisma.product.update({
			where: {
				id: req.params.id,
			},
			data: parsedBody.data,
		});

		res.status(200).json({ data: updatedProduct });
	} catch (error) {
		next(error);
	}
};

export default updateProduct;
