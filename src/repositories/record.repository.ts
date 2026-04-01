import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../utils/prisma.js";

type ListRecordsArgs = {
	where: Prisma.FinancialRecordWhereInput;
	orderBy: Prisma.FinancialRecordOrderByWithRelationInput;
	skip: number;
	take: number;
};

export const recordRepository = {
	create(data: Prisma.FinancialRecordCreateInput) {
		return prisma.financialRecord.create({ data });
	},

	findMany(args: ListRecordsArgs) {
		return prisma.financialRecord.findMany({
			where: args.where,
			orderBy: args.orderBy,
			skip: args.skip,
			take: args.take,
		});
	},

	count(where: Prisma.FinancialRecordWhereInput) {
		return prisma.financialRecord.count({ where });
	},

	findById(id: string) {
		return prisma.financialRecord.findFirst({
			where: {
				id,
				deletedAt: null,
			},
		});
	},

	updateById(id: string, data: Prisma.FinancialRecordUpdateInput) {
		return prisma.financialRecord.updateMany({
			where: {
				id,
				deletedAt: null,
			},
			data,
		});
	},
};