export interface Block {
  id: string;
  type: string;
  props: Record<string, unknown>;
}

export type BlockType =
  | "hero"
  | "text"
  | "image"
  | "feature-grid"
  | "cta"
  | "contact"
  | "faq"
  | "testimonials";
