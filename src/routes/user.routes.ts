import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { Role } from "../generated/prisma/enums.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const userRoutes = Router();

userRoutes.use(authenticate);
userRoutes.use(authorize([Role.ADMIN]));

userRoutes.get("/", userController.getAll);
userRoutes.patch("/:id/role", userController.updateRole);
userRoutes.patch("/:id/status", userController.updateStatus);

export { userRoutes };