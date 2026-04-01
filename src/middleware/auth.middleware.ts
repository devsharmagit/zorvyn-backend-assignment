import type { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { Role } from "../generated/prisma/enums.js";
import { env } from "../env.js";

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
		return res.status(401).json({ message: "Missing token" });
	}

	try {
		const decoded = jwt.verify(token, env.JWT_SECRET);

		if (!isAuthTokenPayload(decoded)) {
			return res.status(401).json({ message: "Invalid token" });
		}

		req.user = {
			userId: decoded.userId,
			role: decoded.role,
		};

		return next();
	} catch (error) {
		if (error instanceof JsonWebTokenError || error instanceof TokenExpiredError) {
			return res.status(401).json({ message: "Invalid token" });
		}

		return res.status(500).json({ message: "Internal server error" });
	}
}

export function authorize(allowedRoles: Role[]) {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!req.user) {
			return res.status(401).json({ message: "Missing token" });
		}

		if (!allowedRoles.includes(req.user.role)) {
			return res.status(403).json({ message: "Forbidden" });
		}

		return next();
	};
}