import type { NextFunction, Request, Response } from "express";
import type { GetRecordsQueryInput } from "../schemas/record.schema.js";
import { RecordNotFoundError, recordService } from "../services/record.service.js";
import { AppError } from "../utils/app-error.js";

export const recordController = {
	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const record = await recordService.create(req.body, req.user!.userId);
			return res.status(201).json({
				success: true,
				message: "Record created successfully",
				data: record,
			});
		} catch (error) {
			return next(error);
		}
	},

	async getAll(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await recordService.getAll(req.query as unknown as GetRecordsQueryInput);
			return res.status(200).json({
				success: true,
				message: "Records fetched successfully",
				data: result,
			});
		} catch (error) {
			return next(error);
		}
	},

	async getById(req: Request, res: Response, next: NextFunction) {
		try {
			const record = await recordService.getById(req.params.id as string);
			return res.status(200).json({
				success: true,
				message: "Record fetched successfully",
				data: record,
			});
		} catch (error) {
			if (error instanceof RecordNotFoundError) {
				return next(new AppError(error.message, 404, "RECORD_NOT_FOUND"));
			}

			return next(error);
		}
	},

	async updateById(req: Request, res: Response, next: NextFunction) {
		try {
			const record = await recordService.updateById(req.params.id as string, req.body);
			return res.status(200).json({
				success: true,
				message: "Record updated successfully",
				data: record,
			});
		} catch (error) {
			if (error instanceof RecordNotFoundError) {
				return next(new AppError(error.message, 404, "RECORD_NOT_FOUND"));
			}

			return next(error);
		}
	},

	async softDeleteById(req: Request, res: Response, next: NextFunction) {
		try {
			await recordService.softDeleteById(req.params.id as string);
			return res.status(200).json({
				success: true,
				message: "Record deleted successfully",
				data: null,
			});
		} catch (error) {
			if (error instanceof RecordNotFoundError) {
				return next(new AppError(error.message, 404, "RECORD_NOT_FOUND"));
			}

			return next(error);
		}
	},
};