import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '@/prisma';
import { AccessTokenSchema } from '@/schemas';

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// Validate the request body
		const parsedBody = AccessTokenSchema.safeParse(req.body);
		if (!parsedBody.success) {
			return res.status(400).json({ errors: parsedBody.error.errors });
		}

		const { accessToken } = parsedBody.data;
		const decoded = jwt.verify(accessToken, process.env.JWT_SECRET as string);

		const user = await prisma.user.findUnique({
			where: { id: (decoded as any).userId },
			select: {
				id: true,
				email: true,
				name: true,
				role: true,
			},
		});

		if (!user) {
			return res.status(401).json({ message: 'Unauthorized' });
		}

		return res.status(200).json({ message: 'Authorized', user });
	} catch (error) {
		next(error);
	}
};

export default verifyToken;
