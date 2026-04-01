import type { NextFunction, Request, Response } from "express";
import { UserNotFoundError, userService } from "../services/user.service.js";
import { AppError } from "../utils/app-error.js";

export const userController = {
	async getAll(_req: Request, res: Response, next: NextFunction) {
		try {
			const users = await userService.getAll();
			return res.status(200).json(users);
		} catch (error) {
			return next(error);
		}
	},

	async updateRole(req: Request, res: Response, next: NextFunction) {
		try {
			const user = await userService.updateRole(req.params.id as string, req.body.role);
			return res.status(200).json(user);
		} catch (error) {
			if (error instanceof UserNotFoundError) {
				return next(new AppError(error.message, 404, "USER_NOT_FOUND"));
			}

			return next(error);
		}
	},

	async updateStatus(req: Request, res: Response, next: NextFunction) {
		try {
			const user = await userService.updateStatus(req.params.id as string, req.body.isActive);
			return res.status(200).json(user);
		} catch (error) {
			if (error instanceof UserNotFoundError) {
				return next(new AppError(error.message, 404, "USER_NOT_FOUND"));
			}

			return next(error);
		}
	},
};