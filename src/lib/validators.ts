import { z } from "zod";

// ── Auth ──────────────────────────────────────────────────────────

export const signupSchema = z.object({
  name: z.string().min(2, "Nome muito curto").max(100, "Nome muito longo"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
});

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});

// ── Workspace ─────────────────────────────────────────────────────

export const createWorkspaceSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z
    .string()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9-]+$/, "Slug inválido: use apenas letras, números e hífens"),
});

// ── Sites ─────────────────────────────────────────────────────────

export const createSiteSchema = z.object({
  name: z.string().min(2, "Nome muito curto").max(100, "Nome muito longo"),
  slug: z
    .string()
    .min(2, "Slug muito curto")
    .max(60, "Slug muito longo")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug inválido: use apenas letras minúsculas, números e hífens"
    ),
  description: z.string().max(500).optional(),
  language: z.string().default("pt-BR"),
  primaryColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Cor inválida")
    .default("#6366f1"),
});

export const updateSiteSchema = createSiteSchema.partial().extend({
  logoUrl: z.string().url().optional().nullable(),
  faviconUrl: z.string().url().optional().nullable(),
  timezone: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  googleSiteVerification: z.string().max(200).optional().nullable(),
});

// ── Pages ─────────────────────────────────────────────────────────

export const createPageSchema = z.object({
  title: z.string().min(1, "Título obrigatório").max(200),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(
      /^[a-z0-9-/]+$/,
      "Slug inválido"
    ),
  template: z.string().optional(),
  templateId: z.string().cuid().optional(),
});

export const updatePageMetaSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-/]+$/).optional(),
  showInNav: z.boolean().optional(),
  navOrder: z.number().int().optional(),
});

export const seoSchema = z.object({
  seoTitle: z.string().max(60, "Máximo 60 caracteres").optional().nullable(),
  seoDescription: z
    .string()
    .max(160, "Máximo 160 caracteres")
    .optional()
    .nullable(),
  canonicalUrl: z.string().url().optional().nullable(),
  robotsIndex: z.boolean().default(true),
  robotsFollow: z.boolean().default(true),
  ogTitle: z.string().max(60).optional().nullable(),
  ogDescription: z.string().max(200).optional().nullable(),
  ogImageUrl: z.string().url().optional().nullable(),
});

export const saveBlocksSchema = z.object({
  blocks: z
    .array(
      z.object({
        id: z.string().min(1),
        type: z.string().min(1),
        props: z.record(z.unknown()),
      })
    )
    .max(50, "Máximo de 50 blocos por página"),
});

// ── Posts ─────────────────────────────────────────────────────────

export const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().max(300).optional(),
});

export const updatePostSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/).optional(),
  excerpt: z.string().max(300).optional().nullable(),
  coverImageUrl: z.string().url().optional().nullable(),
  content: z.record(z.unknown()).optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
  publishedAt: z.string().datetime().optional().nullable(),
  ...seoSchema.shape,
});

// ── Media ─────────────────────────────────────────────────────────

export const updateMediaSchema = z.object({
  altText: z.string().max(300).optional(),
  caption: z.string().max(500).optional(),
});

// ── Account ───────────────────────────────────────────────────────

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });
