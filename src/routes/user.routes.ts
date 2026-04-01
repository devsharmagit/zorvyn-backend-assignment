import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { Role } from "../generated/prisma/enums.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { emptyQuerySchema } from "../schemas/common.schema.js";
import {
	updateUserRoleSchema,
	updateUserStatusSchema,
	userIdParamSchema,
} from "../schemas/user.schema.js";

const userRoutes = Router();

userRoutes.use(authenticate);
userRoutes.use(authorize([Role.ADMIN]));

userRoutes.get("/", validate({ query: emptyQuerySchema }), userController.getAll);
userRoutes.patch(
	"/:id/role",
	validate({ params: userIdParamSchema, body: updateUserRoleSchema }),
	userController.updateRole,
);
userRoutes.patch(
	"/:id/status",
	validate({ params: userIdParamSchema, body: updateUserStatusSchema }),
	userController.updateStatus,
);

export { userRoutes };