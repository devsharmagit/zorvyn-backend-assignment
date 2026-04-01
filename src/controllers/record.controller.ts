import type { Request, Response } from "express";
import {
	createRecordSchema,
	getRecordsQuerySchema,
	updateRecordSchema,
} from "../schemas/record.schema.js";
import { RecordNotFoundError, recordService } from "../services/record.service.js";

export const recordController = {
	async create(req: Request, res: Response) {
		const parsed = createRecordSchema.safeParse(req.body);
		if (!parsed.success) {
			return res.status(400).json({
				message: "Validation failed",
				errors: parsed.error.flatten(),
			});
		}

		try {
			const record = await recordService.create(parsed.data, req.user!.userId);
			return res.status(201).json(record);
		} catch {
			return res.status(500).json({ message: "Internal server error" });
		}
	},

	async getAll(req: Request, res: Response) {
		const parsed = getRecordsQuerySchema.safeParse(req.query);
		if (!parsed.success) {
			return res.status(400).json({
				message: "Validation failed",
				errors: parsed.error.flatten(),
			});
		}

		try {
			const result = await recordService.getAll(parsed.data);
			return res.status(200).json(result);
		} catch {
			return res.status(500).json({ message: "Internal server error" });
		}
	},

	async getById(req: Request, res: Response) {
		const id = req.params.id;
		if (typeof id !== "string") {
			return res.status(400).json({ message: "Invalid record id" });
		}

		try {
			const record = await recordService.getById(id);
			return res.status(200).json(record);
		} catch (error) {
			if (error instanceof RecordNotFoundError) {
				return res.status(404).json({ message: error.message });
			}

			return res.status(500).json({ message: "Internal server error" });
		}
	},

	async updateById(req: Request, res: Response) {
		const id = req.params.id;
		if (typeof id !== "string") {
			return res.status(400).json({ message: "Invalid record id" });
		}

		const parsed = updateRecordSchema.safeParse(req.body);
		if (!parsed.success) {
			return res.status(400).json({
				message: "Validation failed",
				errors: parsed.error.flatten(),
			});
		}

		try {
			const record = await recordService.updateById(id, parsed.data);
			return res.status(200).json(record);
		} catch (error) {
			if (error instanceof RecordNotFoundError) {
				return res.status(404).json({ message: error.message });
			}

			return res.status(500).json({ message: "Internal server error" });
		}
	},

	async softDeleteById(req: Request, res: Response) {
		const id = req.params.id;
		if (typeof id !== "string") {
			return res.status(400).json({ message: "Invalid record id" });
		}

		try {
			await recordService.softDeleteById(id);
			return res.status(204).send();
		} catch (error) {
			if (error instanceof RecordNotFoundError) {
				return res.status(404).json({ message: error.message });
			}

			return res.status(500).json({ message: "Internal server error" });
		}
	},
};