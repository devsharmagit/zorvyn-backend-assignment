import { Prisma } from "../generated/prisma/client.js";
import { recordRepository } from "../repositories/record.repository.js";
import type {
	CreateRecordInput,
	GetRecordsQueryInput,
	UpdateRecordInput,
} from "../schemas/record.schema.js";

export class RecordNotFoundError extends Error {
	constructor() {
		super("Record not found");
		this.name = "RecordNotFoundError";
	}
}

export const recordService = {
	create(input: CreateRecordInput, userId: string) {
		return recordRepository.create({
			amount: new Prisma.Decimal(input.amount),
			type: input.type,
			category: input.category,
			date: input.date,
			notes: input.notes ?? null,
			user: {
				connect: { id: userId },
			},
		});
	},

	async getAll(query: GetRecordsQueryInput) {
		const page = query.page ?? 1;
		const limit = query.limit ?? 10;
		const sortBy = query.sortBy ?? "date";
		const order = query.order ?? "desc";

		const where: Prisma.FinancialRecordWhereInput = {
			deletedAt: null,
		};

		if (query.type) {
			where.type = query.type;
		}

		if (query.category) {
			where.category = query.category;
		}

		if (query.startDate || query.endDate) {
			const dateFilter: Prisma.DateTimeFilter<"FinancialRecord"> = {};
			if (query.startDate) {
				dateFilter.gte = query.startDate;
			}
			if (query.endDate) {
				dateFilter.lte = query.endDate;
			}
			where.date = dateFilter;
		}

		const skip = (page - 1) * limit;
		const [items, total] = await Promise.all([
			recordRepository.findMany({
				where,
				orderBy: {
					[sortBy]: order,
				},
				skip,
				take: limit,
			}),
			recordRepository.count(where),
		]);

		return {
			items,
			meta: {
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit),
			},
		};
	},

	async getById(id: string) {
		const record = await recordRepository.findById(id);

		if (!record) {
			throw new RecordNotFoundError();
		}

		return record;
	},

	async updateById(id: string, input: UpdateRecordInput) {
		const updateData: Prisma.FinancialRecordUpdateInput = {
			...(input.amount !== undefined
				? { amount: new Prisma.Decimal(input.amount) }
				: {}),
			...(input.type !== undefined ? { type: input.type } : {}),
			...(input.category !== undefined ? { category: input.category } : {}),
			...(input.date !== undefined ? { date: input.date } : {}),
			...(input.notes !== undefined ? { notes: input.notes } : {}),
		};

		const result = await recordRepository.updateById(id, updateData);

		if (result.count === 0) {
			throw new RecordNotFoundError();
		}

		return recordRepository.findById(id);
	},

	async softDeleteById(id: string) {
		const result = await recordRepository.updateById(id, {
			deletedAt: new Date(),
		});

		if (result.count === 0) {
			throw new RecordNotFoundError();
		}
	},
};