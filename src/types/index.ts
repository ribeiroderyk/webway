// ── Block types ───────────────────────────────────────────────────

export interface Block {
  id: string;
  type: string;
  props: Record<string, unknown>;
}

export interface HeroProps {
  headline: string;
  subheadline: string;
  eyebrow: string;
  buttonText: string;
  buttonUrl: string;
  imageUrl: string;
  alignment: "left" | "center";
  bgColor: string;
}

export interface TextProps {
  title: string;
  content: string;
  alignment: "left" | "center" | "right";
}

export interface ImageProps {
  imageUrl: string;
  altText: string;
  caption: string;
  aspectRatio: "16:9" | "4:3" | "1:1" | "auto";
}

export interface FeatureItem {
  title: string;
  description: string;
  icon: string;
}

export interface FeatureGridProps {
  title: string;
  description: string;
  features: FeatureItem[];
}

export interface CtaProps {
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  bgColor: string;
}

export interface ContactProps {
  title: string;
  description: string;
  email: string;
  phone: string;
  address: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqProps {
  title: string;
  items: FaqItem[];
}

export interface TestimonialItem {
  name: string;
  role: string;
  content: string;
  avatarUrl: string;
}

export interface TestimonialsProps {
  title: string;
  testimonials: TestimonialItem[];
}

// ── API response types ────────────────────────────────────────────

export interface ApiSuccess<T = unknown> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  code: string;
  details?: Record<string, unknown>;
}

// ── Session ───────────────────────────────────────────────────────

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: "USER" | "ADMIN";
}

// ── SEO Audit ─────────────────────────────────────────────────────

export interface SeoCheck {
  id: string;
  label: string;
  points: number;
  passed: boolean;
  suggestion: string;
}

export interface SeoAuditResult {
  score: number;
  checks: SeoCheck[];
}
