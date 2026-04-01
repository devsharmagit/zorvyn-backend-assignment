import type { Request, Response } from "express";
import { dashboardService } from "../services/dashboard.service.js";

export const dashboardController = {
	async getSummary(_req: Request, res: Response) {
		try {
			const summary = await dashboardService.getSummary();
			return res.status(200).json(summary);
		} catch {
			return res.status(500).json({ message: "Internal server error" });
		}
	},

	async getByCategory(_req: Request, res: Response) {
		try {
			const result = await dashboardService.getByCategory();
			return res.status(200).json(result);
		} catch {
			return res.status(500).json({ message: "Internal server error" });
		}
	},

	async getMonthlyTrends(_req: Request, res: Response) {
		try {
			const trends = await dashboardService.getMonthlyTrends();
			return res.status(200).json(trends);
		} catch {
			return res.status(500).json({ message: "Internal server error" });
		}
	},

	async getRecent(_req: Request, res: Response) {
		try {
			const recent = await dashboardService.getRecent();
			return res.status(200).json(recent);
		} catch {
			return res.status(500).json({ message: "Internal server error" });
		}
	},
};