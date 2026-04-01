import type { Request, Response } from "express";
import {
	updateUserRoleSchema,
	updateUserStatusSchema,
} from "../schemas/user.schema.js";
import { UserNotFoundError, userService } from "../services/user.service.js";

export const userController = {
	async getAll(_req: Request, res: Response) {
		try {
			const users = await userService.getAll();
			return res.status(200).json(users);
		} catch {
			return res.status(500).json({ message: "Internal server error" });
		}
	},

	async updateRole(req: Request, res: Response) {
		const id = req.params.id;
		if (typeof id !== "string") {
			return res.status(400).json({ message: "Invalid user id" });
		}

		const parsed = updateUserRoleSchema.safeParse(req.body);
		if (!parsed.success) {
			return res.status(400).json({
				message: "Validation failed",
				errors: parsed.error.flatten(),
			});
		}

		try {
			const user = await userService.updateRole(id, parsed.data.role);
			return res.status(200).json(user);
		} catch (error) {
			if (error instanceof UserNotFoundError) {
				return res.status(404).json({ message: error.message });
			}

			return res.status(500).json({ message: "Internal server error" });
		}
	},

	async updateStatus(req: Request, res: Response) {
		const id = req.params.id;
		if (typeof id !== "string") {
			return res.status(400).json({ message: "Invalid user id" });
		}

		const parsed = updateUserStatusSchema.safeParse(req.body);
		if (!parsed.success) {
			return res.status(400).json({
				message: "Validation failed",
				errors: parsed.error.flatten(),
			});
		}

		try {
			const user = await userService.updateStatus(id, parsed.data.isActive);
			return res.status(200).json(user);
		} catch (error) {
			if (error instanceof UserNotFoundError) {
				return res.status(404).json({ message: error.message });
			}

			return res.status(500).json({ message: "Internal server error" });
		}
	},
};