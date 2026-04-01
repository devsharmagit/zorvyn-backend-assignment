import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/app-error.js";

export function notFoundHandler(_req: Request, _res: Response, next: NextFunction) {
	next(new AppError("Route not found", 404, "NOT_FOUND"));
}

export function globalErrorHandler(
	error: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction,
) {
	if (error instanceof ZodError) {
		return res.status(400).json({
			success: false,
			message: "Validation failed",
			data: {
				code: "VALIDATION_ERROR",
				details: error.flatten(),
			},
		});
	}

	if (error instanceof AppError) {
		return res.status(error.statusCode).json({
			success: false,
			message: error.message,
			data: {
				code: error.code,
				...(error.details !== undefined ? { details: error.details } : {}),
			},
		});
	}
	console.log(error);

	return res.status(500).json({
		success: false,
		message: "Internal server error",
		data: {
			code: "INTERNAL_SERVER_ERROR",
		},
	});
}