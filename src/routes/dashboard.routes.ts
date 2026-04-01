import { Router } from "express";
import { dashboardController } from "../controllers/dashboard.controller.js";
import { Role } from "../generated/prisma/enums.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const dashboardRoutes = Router();

dashboardRoutes.use(authenticate);
dashboardRoutes.use(authorize([Role.ADMIN, Role.ANALYST]));

dashboardRoutes.get("/summary", dashboardController.getSummary);
dashboardRoutes.get("/by-category", dashboardController.getByCategory);
dashboardRoutes.get("/monthly-trends", dashboardController.getMonthlyTrends);
dashboardRoutes.get("/recent", dashboardController.getRecent);

export { dashboardRoutes };