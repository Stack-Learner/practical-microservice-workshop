import { z } from 'zod';

export const UserCreateSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6).max(255),
	name: z.string().min(3).max(255),
});

export const UserLoginSchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

export const AccessTokenSchema = z.object({
	accessToken: z.string(),
});

export const EmailVerificationSchema = z.object({
	email: z.string().email(),
	code: z.string(),
});
