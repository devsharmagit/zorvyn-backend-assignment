import type { Request, Response } from "express";
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
		try {
			const user = await userService.updateRole(req.params.id as string, req.body.role);
			return res.status(200).json(user);
		} catch (error) {
			if (error instanceof UserNotFoundError) {
				return res.status(404).json({ message: error.message });
			}

			return res.status(500).json({ message: "Internal server error" });
		}
	},

	async updateStatus(req: Request, res: Response) {
		try {
			const user = await userService.updateStatus(req.params.id as string, req.body.isActive);
			return res.status(200).json(user);
		} catch (error) {
			if (error instanceof UserNotFoundError) {
				return res.status(404).json({ message: error.message });
			}

			return res.status(500).json({ message: "Internal server error" });
		}
	},
};