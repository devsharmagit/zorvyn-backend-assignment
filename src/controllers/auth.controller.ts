import type { Request, Response } from "express";
import {
	authService,
	DuplicateEmailError,
	InvalidCredentialsError,
} from "../services/auth.service.js";

export const authController = {
	async register(req: Request, res: Response) {
		try {
			const result = await authService.register(req.body);
			return res.status(201).json(result);
		} catch (error) {
			if (error instanceof DuplicateEmailError) {
				return res.status(409).json({
					message: error.message,
				});
			}

			return res.status(500).json({
				message: "Internal server error",
			});
		}
	},

	async login(req: Request, res: Response) {
		try {
			const result = await authService.login(req.body);
			return res.status(200).json(result);
		} catch (error) {
			if (error instanceof InvalidCredentialsError) {
				return res.status(401).json({
					message: error.message,
				});
			}

			return res.status(500).json({
				message: "Internal server error",
			});
		}
	},
};