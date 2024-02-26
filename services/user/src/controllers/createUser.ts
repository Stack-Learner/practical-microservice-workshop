import { Request, Response, NextFunction } from 'express';
import { UserCreateSchema } from '@/schemas';
import prisma from '@/prisma';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// Validate the request body
		const parsedBody = UserCreateSchema.safeParse(req.body);
		if (!parsedBody.success) {
			return res.status(400).json({ message: parsedBody.error.errors });
		}

		// check if the authUserId already exists
		const existingUser = await prisma.user.findUnique({
			where: { authUserId: parsedBody.data.authUserId },
		});
		if (existingUser) {
			return res.status(400).json({ message: 'User already exists' });
		}

		// Create a new user
		const user = await prisma.user.create({
			data: parsedBody.data,
		});

		return res.status(201).json(user);
	} catch (error) {
		next(error);
	}
};

export default createUser;
