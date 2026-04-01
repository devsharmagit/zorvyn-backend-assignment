import * as z from "zod";
import { RecordType } from "../generated/prisma/enums.js";

export const createRecordSchema = z.object({
	amount: z.coerce.number().finite().positive(),
	type: z.enum(RecordType),
	category: z.string().trim().min(1),
	date: z.coerce.date(),
	notes: z.string().trim().optional(),
});

export const updateRecordSchema = z
	.object({
		amount: z.coerce.number().finite().positive().optional(),
		type: z.enum(RecordType).optional(),
		category: z.string().trim().min(1).optional(),
		date: z.coerce.date().optional(),
		notes: z.string().trim().optional(),
	})
	.refine((data) => Object.keys(data).length > 0, {
		message: "At least one field is required",
	});

export const getRecordsQuerySchema = z.object({
	type: z.enum(RecordType).optional(),
	category: z.string().trim().min(1).optional(),
	startDate: z.coerce.date().optional(),
	endDate: z.coerce.date().optional(),
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(10),
	sortBy: z.enum(["date", "amount"]).default("date"),
	order: z.enum(["asc", "desc"]).default("desc"),
})
	.strict()
	.refine(
		(data) => !data.startDate || !data.endDate || data.startDate <= data.endDate,
		{
			message: "startDate must be before or equal to endDate",
			path: ["startDate"],
		},
	);

export const recordIdParamSchema = z.object({
	id: z.string().trim().min(1),
});

export type CreateRecordInput = z.infer<typeof createRecordSchema>;
export type UpdateRecordInput = z.infer<typeof updateRecordSchema>;
export type GetRecordsQueryInput = z.infer<typeof getRecordsQuerySchema>;