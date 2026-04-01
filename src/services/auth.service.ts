import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../env.js";
import { authRepository } from "../repositories/auth.repository.js";
import type { LoginInput, RegisterInput } from "../schemas/auth.schema.js";

export class DuplicateEmailError extends Error {
	constructor() {
		super("Email is already registered");
		this.name = "DuplicateEmailError";
	}
}

export class InvalidCredentialsError extends Error {
	constructor() {
		super("Invalid email or password");
		this.name = "InvalidCredentialsError";
	}
}

type RegisterResult = {
	token: string;
	user: {
		id: string;
		name: string;
		email: string;
		role: string;
		createdAt: Date;
	};
};

function signAuthToken(userId: string, role: string) {
	return jwt.sign({ userId, role }, env.JWT_SECRET, { expiresIn: "1h" });
}

export const authService = {
	async register(input: RegisterInput): Promise<RegisterResult> {
		const email = input.email.toLowerCase();
		const existingUser = await authRepository.findUserByEmail(email);

		if (existingUser) {
			throw new DuplicateEmailError();
		}

		const passwordHash = await bcrypt.hash(input.password, 10);
		const user = await authRepository.createUser({
			name: input.name,
			email,
			passwordHash,
		});

		const token = signAuthToken(user.id, user.role);

		return {
			token,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
				createdAt: user.createdAt,
			},
		};
	},

	async login(input: LoginInput): Promise<RegisterResult> {
		const email = input.email.toLowerCase();
		const user = await authRepository.findUserByEmail(email);

		if (!user) {
			throw new InvalidCredentialsError();
		}

		const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);

		if (!isPasswordValid) {
			throw new InvalidCredentialsError();
		}

		const token = signAuthToken(user.id, user.role);

		return {
			token,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
				createdAt: user.createdAt,
			},
		};
	},
};