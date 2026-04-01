import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { Prisma, PrismaClient } from "../src/generated/prisma/client.ts";

const databaseUrl = process.env.DATABASE_URL ?? "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
const prisma = new PrismaClient({ adapter });

async function upsertUsers() {
  const passwordHash = await bcrypt.hash("Password@123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@zorvyn.local" },
    update: { name: "Admin User", role: "ADMIN", isActive: true, passwordHash },
    create: {
      name: "Admin User",
      email: "admin@zorvyn.local",
      passwordHash,
      role: "ADMIN",
      isActive: true,
    },
  });

  const analyst = await prisma.user.upsert({
    where: { email: "analyst@zorvyn.local" },
    update: { name: "Analyst User", role: "USER", isActive: true, passwordHash },
    create: {
      name: "Analyst User",
      email: "analyst@zorvyn.local",
      passwordHash,
      role: "USER",
      isActive: true,
    },
  });

  const viewer = await prisma.user.upsert({
    where: { email: "viewer@zorvyn.local" },
    update: { name: "Viewer User", role: "USER", isActive: true, passwordHash },
    create: {
      name: "Viewer User",
      email: "viewer@zorvyn.local",
      passwordHash,
      role: "USER",
      isActive: true,
    },
  });

  return [admin, analyst, viewer];
}

function buildSampleRecords(userIds: string[]): Prisma.FinancialRecordCreateManyInput[] {
  const now = Date.now();
  const templates: Array<Omit<Prisma.FinancialRecordCreateManyInput, "date" | "createdBy">> = [
    { amount: 5200, type: "INCOME", category: "Salary", notes: "Monthly payroll" },
    { amount: 1300, type: "EXPENSE", category: "Rent", notes: "Apartment rent" },
    { amount: 240, type: "EXPENSE", category: "Groceries", notes: "Weekly groceries" },
    { amount: 90, type: "EXPENSE", category: "Internet", notes: "Broadband bill" },
    { amount: 140, type: "EXPENSE", category: "Utilities", notes: "Electricity and water" },
    { amount: 310, type: "EXPENSE", category: "Transport", notes: "Fuel and cab" },
    { amount: 450, type: "INCOME", category: "Freelance", notes: "Consulting" },
    { amount: 180, type: "EXPENSE", category: "Health", notes: "Pharmacy" },
    { amount: 220, type: "EXPENSE", category: "Dining", notes: "Team lunch" },
    { amount: 800, type: "INCOME", category: "Bonus", notes: "Quarterly bonus" },
    { amount: 95, type: "EXPENSE", category: "Subscriptions", notes: "SaaS and OTT" },
    { amount: 160, type: "EXPENSE", category: "Shopping", notes: "Essentials" },
  ];

  return templates.map((item, index) => ({
    ...item,
    date: new Date(now - index * 86400000),
    createdBy: userIds[index % userIds.length],
  }));
}

async function main() {
  const users = await upsertUsers();
  const userIds = users.map((user) => user.id);

  await prisma.financialRecord.deleteMany({
    where: {
      createdBy: {
        in: userIds,
      },
    },
  });

  const sampleRecords = buildSampleRecords(userIds);
  await prisma.financialRecord.createMany({ data: sampleRecords });

  console.log(`Seeded ${users.length} users and ${sampleRecords.length} records.`);
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
