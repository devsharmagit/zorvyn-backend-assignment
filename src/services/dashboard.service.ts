import { RecordType } from "../generated/prisma/enums.js";
import { prisma } from "../utils/prisma.js";

function toNumber(value: unknown) {
	if (typeof value === "number") {
		return value;
	}

	if (typeof value === "string") {
		return Number(value);
	}

	if (value && typeof value === "object" && "toString" in value) {
		return Number(value.toString());
	}

	return 0;
}

function startOfMonth(date: Date) {
	return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}

function endOfMonth(date: Date) {
	return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

function monthKey(date: Date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	return `${year}-${month}`;
}

export const dashboardService = {
	async getSummary() {
		const [incomeAgg, expenseAgg] = await Promise.all([
			prisma.financialRecord.aggregate({
				where: {
					type: RecordType.INCOME,
					deletedAt: null,
				},
				_sum: { amount: true },
			}),
			prisma.financialRecord.aggregate({
				where: {
					type: RecordType.EXPENSE,
					deletedAt: null,
				},
				_sum: { amount: true },
			}),
		]);

		const totalIncome = toNumber(incomeAgg._sum.amount);
		const totalExpenses = toNumber(expenseAgg._sum.amount);

		return {
			totalIncome,
			totalExpenses,
			netBalance: totalIncome - totalExpenses,
		};
	},

	async getByCategory() {
		const grouped = await prisma.financialRecord.groupBy({
			by: ["category", "type"],
			where: {
				deletedAt: null,
			},
			_sum: {
				amount: true,
			},
		});

		const map = new Map<
			string,
			{ category: string; income: number; expense: number; net: number }
		>();

		for (const row of grouped) {
			const amount = toNumber(row._sum.amount);
			const current = map.get(row.category) ?? {
				category: row.category,
				income: 0,
				expense: 0,
				net: 0,
			};

			if (row.type === RecordType.INCOME) {
				current.income += amount;
			} else {
				current.expense += amount;
			}

			current.net = current.income - current.expense;
			map.set(row.category, current);
		}

		return Array.from(map.values()).sort((a, b) => b.net - a.net);
	},

	async getMonthlyTrends() {
		const now = new Date();
		const months: { key: string; start: Date; end: Date }[] = [];

		for (let i = 5; i >= 0; i -= 1) {
			const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
			months.push({
				key: monthKey(d),
				start: startOfMonth(d),
				end: endOfMonth(d),
			});
		}

		const firstMonth = months[0];
		const lastMonth = months[months.length - 1];
		if (!firstMonth || !lastMonth) {
			return [];
		}

		const records = await prisma.financialRecord.findMany({
			where: {
				deletedAt: null,
				date: {
					gte: firstMonth.start,
					lte: lastMonth.end,
				},
			},
			select: {
				date: true,
				type: true,
				amount: true,
			},
		});

		const trendMap = new Map<string, { month: string; income: number; expense: number }>();
		for (const month of months) {
			trendMap.set(month.key, { month: month.key, income: 0, expense: 0 });
		}

		for (const record of records) {
			const key = monthKey(record.date);
			const bucket = trendMap.get(key);
			if (!bucket) {
				continue;
			}

			const amount = toNumber(record.amount);
			if (record.type === RecordType.INCOME) {
				bucket.income += amount;
			} else {
				bucket.expense += amount;
			}
		}

		return months.map((m) => trendMap.get(m.key)!);
	},

	getRecent() {
		return prisma.financialRecord.findMany({
			where: {
				deletedAt: null,
			},
			orderBy: {
				createdAt: "desc",
			},
			take: 10,
		});
	},
};