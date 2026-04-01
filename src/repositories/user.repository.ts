import { prisma } from "../utils/prisma.js";
import type { Role } from "../generated/prisma/enums.js";

export const userRepository = {
	findAll() {
		return prisma.user.findMany({
			orderBy: {
				createdAt: "desc",
			},
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				isActive: true,
				createdAt: true,
			},
		});
	},

	updateRoleById(id: string, role: Role) {
		return prisma.user.updateMany({
			where: { id },
			data: { role },
		});
	},

	updateStatusById(id: string, isActive: boolean) {
		return prisma.user.updateMany({
			where: { id },
			data: { isActive },
		});
	},

	findById(id: string) {
		return prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				isActive: true,
				createdAt: true,
			},
		});
	},
};