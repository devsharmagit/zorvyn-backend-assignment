import { Router } from "express";
import { recordController } from "../controllers/record.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { Role } from "../generated/prisma/enums.js";

const recordRoutes = Router();

recordRoutes.use(authenticate);

recordRoutes.post("/", authorize([Role.ADMIN]), recordController.create);
recordRoutes.get("/", authorize([Role.ADMIN, Role.ANALYST]), recordController.getAll);
recordRoutes.get("/:id", authorize([Role.ADMIN, Role.ANALYST]), recordController.getById);
recordRoutes.patch("/:id", authorize([Role.ADMIN]), recordController.updateById);
recordRoutes.delete("/:id", authorize([Role.ADMIN]), recordController.softDeleteById);

export { recordRoutes };