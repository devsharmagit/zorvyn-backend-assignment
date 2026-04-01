import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Role } from "../generated/prisma/enums.js";
import { env } from "../env.js";
import { AppError } from "../utils/app-error.js";
import pkg from 'jsonwebtoken';
const { JsonWebTokenError, TokenExpiredError } = pkg;

type AuthTokenPayload = {
	userId: string;
	role: Role;
};

function extractBearerToken(authorizationHeader?: string) {
	if (!authorizationHeader) {
		return null;
	}

	const [scheme, token] = authorizationHeader.split(" ");

	if (scheme !== "Bearer" || !token) {
		return null;
	}

	return token;
}

function isAuthTokenPayload(payload: unknown): payload is AuthTokenPayload {
	if (!payload || typeof payload !== "object") {
		return false;
	}

	const candidate = payload as Record<string, unknown>;
	return (
		typeof candidate.userId === "string" &&
		(candidate.role === Role.USER ||
			candidate.role === Role.ADMIN ||
			candidate.role === Role.ANALYST)
	);
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
	const token = extractBearerToken(req.header("authorization"));

	if (!token) {
		return next(new AppError("Missing token", 401, "AUTH_TOKEN_MISSING"));
	}

	try {
		const decoded = jwt.verify(token, env.JWT_SECRET);

		if (!isAuthTokenPayload(decoded)) {
			return next(new AppError("Invalid token", 401, "AUTH_TOKEN_INVALID"));
		}

		req.user = {
			userId: decoded.userId,
			role: decoded.role,
		};

		return next();
	} catch (error) {
		if (error instanceof JsonWebTokenError || error instanceof TokenExpiredError) {
			return next(new AppError("Invalid token", 401, "AUTH_TOKEN_INVALID"));
		}

		return next(error);
	}
}

export function authorize(allowedRoles: Role[]) {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!req.user) {
			return next(new AppError("Missing token", 401, "AUTH_TOKEN_MISSING"));
		}

		if (!allowedRoles.includes(req.user.role)) {
			return next(new AppError("Forbidden", 403, "FORBIDDEN"));
		}

		return next();
	};
}