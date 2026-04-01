import { Router } from "express";
import { recordController } from "../controllers/record.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { Role } from "../generated/prisma/enums.js";
import { validate } from "../middleware/validate.middleware.js";
import {
	createRecordSchema,
	getRecordsQuerySchema,
	recordIdParamSchema,
	updateRecordSchema,
} from "../schemas/record.schema.js";

const recordRoutes = Router();

recordRoutes.use(authenticate);

recordRoutes.post(
	"/",
	authorize([Role.ADMIN]),
	validate({ body: createRecordSchema }),
	recordController.create,
);
recordRoutes.get(
	"/",
	authorize([Role.ADMIN, Role.ANALYST]),
	validate({ query: getRecordsQuerySchema }),
	recordController.getAll,
);
recordRoutes.get(
	"/:id",
	authorize([Role.ADMIN, Role.ANALYST]),
	validate({ params: recordIdParamSchema }),
	recordController.getById,
);
recordRoutes.patch(
	"/:id",
	authorize([Role.ADMIN]),
	validate({ params: recordIdParamSchema, body: updateRecordSchema }),
	recordController.updateById,
);
recordRoutes.delete(
	"/:id",
	authorize([Role.ADMIN]),
	validate({ params: recordIdParamSchema }),
	recordController.softDeleteById,
);

export { recordRoutes };