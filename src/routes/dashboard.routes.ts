import { Router } from "express";
import { dashboardController } from "../controllers/dashboard.controller.js";
import { Role } from "../generated/prisma/enums.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { emptyQuerySchema } from "../schemas/common.schema.js";

const dashboardRoutes = Router();

dashboardRoutes.use(authenticate);
dashboardRoutes.use(authorize([Role.ADMIN, Role.ANALYST]));

dashboardRoutes.get(
	"/summary",
	validate({ query: emptyQuerySchema }),
	dashboardController.getSummary,
);
dashboardRoutes.get(
	"/by-category",
	validate({ query: emptyQuerySchema }),
	dashboardController.getByCategory,
);
dashboardRoutes.get(
	"/monthly-trends",
	validate({ query: emptyQuerySchema }),
	dashboardController.getMonthlyTrends,
);
dashboardRoutes.get(
	"/recent",
	validate({ query: emptyQuerySchema }),
	dashboardController.getRecent,
);

export { dashboardRoutes };