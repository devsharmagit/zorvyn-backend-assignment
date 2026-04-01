import * as z from "zod";
import { Role } from "../generated/prisma/enums.js";

export const updateUserRoleSchema = z.object({
	role: z.enum(Role),
});

export const updateUserStatusSchema = z.object({
	isActive: z.boolean(),
});

export const userIdParamSchema = z.object({
	id: z.string().trim().min(1),
});

export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;