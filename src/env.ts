import * as z from "zod";
import {config} from "dotenv";

config();

const envSchema = z.object({
  PORT: z.string().min(1),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(1),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid or missing environment variables:");
  console.error(parsed.error.format());
  process.exit(1); 
}
export const env = parsed.data;
