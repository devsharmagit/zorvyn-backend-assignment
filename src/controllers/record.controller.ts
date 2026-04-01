import type { Request, Response } from "express";
import type { GetRecordsQueryInput } from "../schemas/record.schema.js";
import { RecordNotFoundError, recordService } from "../services/record.service.js";

export const recordController = {
	async create(req: Request, res: Response) {
		try {
			const record = await recordService.create(req.body, req.user!.userId);
			return res.status(201).json(record);
		} catch {
			return res.status(500).json({ message: "Internal server error" });
		}
	},

	async getAll(req: Request, res: Response) {
		try {
			const result = await recordService.getAll(req.query as unknown as GetRecordsQueryInput);
			return res.status(200).json(result);
		} catch {
			return res.status(500).json({ message: "Internal server error" });
		}
	},

	async getById(req: Request, res: Response) {
		try {
			const record = await recordService.getById(req.params.id as string);
			return res.status(200).json(record);
		} catch (error) {
			if (error instanceof RecordNotFoundError) {
				return res.status(404).json({ message: error.message });
			}

			return res.status(500).json({ message: "Internal server error" });
		}
	},

	async updateById(req: Request, res: Response) {
		try {
			const record = await recordService.updateById(req.params.id as string, req.body);
			return res.status(200).json(record);
		} catch (error) {
			if (error instanceof RecordNotFoundError) {
				return res.status(404).json({ message: error.message });
			}

			return res.status(500).json({ message: "Internal server error" });
		}
	},

	async softDeleteById(req: Request, res: Response) {
		try {
			await recordService.softDeleteById(req.params.id as string);
			return res.status(204).send();
		} catch (error) {
			if (error instanceof RecordNotFoundError) {
				return res.status(404).json({ message: error.message });
			}

			return res.status(500).json({ message: "Internal server error" });
		}
	},
};