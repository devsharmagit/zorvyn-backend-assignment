import type { NextFunction, Request, Response } from "express";
import { dashboardService } from "../services/dashboard.service.js";

export const dashboardController = {
	async getSummary(_req: Request, res: Response, next: NextFunction) {
		try {
			const summary = await dashboardService.getSummary();
			return res.status(200).json({
				success: true,
				message: "Dashboard summary fetched successfully",
				data: summary,
			});
		} catch (error) {
			return next(error);
		}
	},

	async getByCategory(_req: Request, res: Response, next: NextFunction) {
		try {
			const result = await dashboardService.getByCategory();
			return res.status(200).json({
				success: true,
				message: "Category breakdown fetched successfully",
				data: result,
			});
		} catch (error) {
			return next(error);
		}
	},

	async getMonthlyTrends(_req: Request, res: Response, next: NextFunction) {
		try {
			const trends = await dashboardService.getMonthlyTrends();
			return res.status(200).json({
				success: true,
				message: "Monthly trends fetched successfully",
				data: trends,
			});
		} catch (error) {
			return next(error);
		}
	},

	async getRecent(_req: Request, res: Response, next: NextFunction) {
		try {
			const recent = await dashboardService.getRecent();
			return res.status(200).json({
				success: true,
				message: "Recent records fetched successfully",
				data: recent,
			});
		} catch (error) {
			return next(error);
		}
	},
};