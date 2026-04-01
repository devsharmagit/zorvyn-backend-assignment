import type { Role } from "../generated/prisma/enums.js";
import { prisma } from "../utils/prisma.js";

type CreateUserInput = {
	name: string;
	email: string;
	passwordHash: string;
	role?: Role;
};

export const authRepository = {
	findUserByEmail(email: string) {
		return prisma.user.findUnique({
			where: { email },
		});
	},

	createUser(data: CreateUserInput) {
		return prisma.user.create({
			data,
		});
	},
};