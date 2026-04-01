import type { NextFunction, Request, Response } from "express";
import {
	authService,
	DuplicateEmailError,
	InvalidCredentialsError,
} from "../services/auth.service.js";
import { AppError } from "../utils/app-error.js";

export const authController = {
	async register(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await authService.register(req.body);
			return res.status(201).json(result);
		} catch (error) {
			if (error instanceof DuplicateEmailError) {
				return next(new AppError(error.message, 409, "DUPLICATE_EMAIL"));
			}

			return next(error);
		}
	},

	async login(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await authService.login(req.body);
			return res.status(200).json(result);
		} catch (error) {
			if (error instanceof InvalidCredentialsError) {
				return next(new AppError(error.message, 401, "INVALID_CREDENTIALS"));
			}

			return next(error);
		}
	},
};