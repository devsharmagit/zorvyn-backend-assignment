import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
import { AppError } from "../utils/app-error.js";

type ValidateConfig = {
	body?: ZodType;
	query?: ZodType;
	params?: ZodType;
};

export function validate(config: ValidateConfig) {
	return (req: Request, res: Response, next: NextFunction) => {
		if (config.body) {
			const parsedBody = config.body.safeParse(req.body);
			if (!parsedBody.success) {
				return next(
					new AppError("Validation failed", 400, "VALIDATION_ERROR", parsedBody.error.flatten()),
				);
			}
			req.body = parsedBody.data;
		}

		if (config.query) {
			const parsedQuery = config.query.safeParse(req.query);
			if (!parsedQuery.success) {
				return next(
					new AppError("Validation failed", 400, "VALIDATION_ERROR", parsedQuery.error.flatten()),
				);
			}

			Object.defineProperty(req, "query", {
				value: parsedQuery.data as Request["query"],
				writable: true,
				configurable: true,
			});
		}

		if (config.params) {
			const parsedParams = config.params.safeParse(req.params);
			if (!parsedParams.success) {
				return next(
					new AppError("Validation failed", 400, "VALIDATION_ERROR", parsedParams.error.flatten()),
				);
			}

			Object.defineProperty(req, "params", {
				value: parsedParams.data as Request["params"],
				writable: true,
				configurable: true,
			});
		}

		return next();
	};
}