import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL é obrigatória"),
  SESSION_SECRET: z
    .string()
    .min(32, "SESSION_SECRET deve ter pelo menos 32 caracteres"),
  NEXT_PUBLIC_APP_URL: z.string().url("NEXT_PUBLIC_APP_URL deve ser uma URL válida"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  SESSION_EXPIRY_DAYS: z.coerce.number().default(30),
  STORAGE_PROVIDER: z.enum(["local", "s3", "r2", "minio"]).default("local"),
  UPLOAD_DIR: z.string().default("./public/uploads"),
  NEXT_PUBLIC_UPLOADS_URL: z.string().default("/uploads"),
  S3_BUCKET: z.string().optional(),
  S3_REGION: z.string().optional(),
  S3_ACCESS_KEY: z.string().optional(),
  S3_SECRET_KEY: z.string().optional(),
  S3_ENDPOINT: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "❌ Variáveis de ambiente inválidas:\n",
    parsed.error.flatten().fieldErrors
  );
  throw new Error("Variáveis de ambiente inválidas. Verifique o .env");
}

export const env = parsed.data;
