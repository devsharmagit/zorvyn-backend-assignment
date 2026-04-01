import type { NextFunction, Request, Response } from "express";
import { dashboardService } from "../services/dashboard.service.js";

export const dashboardController = {
	async getSummary(_req: Request, res: Response, next: NextFunction) {
		try {
			const summary = await dashboardService.getSummary();
			return res.status(200).json(summary);
		} catch (error) {
			return next(error);
		}
	},

	async getByCategory(_req: Request, res: Response, next: NextFunction) {
		try {
			const result = await dashboardService.getByCategory();
			return res.status(200).json(result);
		} catch (error) {
			return next(error);
		}
	},

	async getMonthlyTrends(_req: Request, res: Response, next: NextFunction) {
		try {
			const trends = await dashboardService.getMonthlyTrends();
			return res.status(200).json(trends);
		} catch (error) {
			return next(error);
		}
	},

	async getRecent(_req: Request, res: Response, next: NextFunction) {
		try {
			const recent = await dashboardService.getRecent();
			return res.status(200).json(recent);
		} catch (error) {
			return next(error);
		}
	},
};