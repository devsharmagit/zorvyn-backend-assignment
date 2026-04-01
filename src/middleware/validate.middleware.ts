import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

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
				return res.status(400).json({
					message: "Validation failed",
					errors: parsedBody.error.flatten(),
				});
			}
			req.body = parsedBody.data;
		}

		if (config.query) {
			const parsedQuery = config.query.safeParse(req.query);
			if (!parsedQuery.success) {
				return res.status(400).json({
					message: "Validation failed",
					errors: parsedQuery.error.flatten(),
				});
			}
			req.query = parsedQuery.data as Request["query"];
		}

		if (config.params) {
			const parsedParams = config.params.safeParse(req.params);
			if (!parsedParams.success) {
				return res.status(400).json({
					message: "Validation failed",
					errors: parsedParams.error.flatten(),
				});
			}
			req.params = parsedParams.data as Request["params"];
		}

		return next();
	};
}