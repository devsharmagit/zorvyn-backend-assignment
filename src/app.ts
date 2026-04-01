import cors from "cors";
import express from "express";
import { authRoutes } from "./routes/auth.routes.js";
import { dashboardRoutes } from "./routes/dashboard.routes.js";
import { recordRoutes } from "./routes/record.routes.js";
import { userRoutes } from "./routes/user.routes.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/records", recordRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/users", userRoutes);

app.get("/health", (_req, res) => {
	res.status(200).json({ status: "ok" });
});
