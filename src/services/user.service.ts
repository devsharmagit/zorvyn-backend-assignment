import type { Role } from "../generated/prisma/enums.js";
import { userRepository } from "../repositories/user.repository.js";

export class UserNotFoundError extends Error {
	constructor() {
		super("User not found");
		this.name = "UserNotFoundError";
	}
}

export const userService = {
	getAll() {
		return userRepository.findAll();
	},

	async updateRole(id: string, role: Role) {
		const result = await userRepository.updateRoleById(id, role);
		if (result.count === 0) {
			throw new UserNotFoundError();
		}

		return userRepository.findById(id);
	},

	async updateStatus(id: string, isActive: boolean) {
		const result = await userRepository.updateStatusById(id, isActive);
		if (result.count === 0) {
			throw new UserNotFoundError();
		}

		return userRepository.findById(id);
	},
};