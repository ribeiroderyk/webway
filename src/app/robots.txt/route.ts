import { env } from "@/lib/env";

export async function GET() {
  const content = `User-agent: *
Allow: /
Allow: /s/
Disallow: /app/
Disallow: /api/
Disallow: /login
Disallow: /signup
Disallow: /forgot-password
Disallow: /reset-password

Sitemap: ${env.NEXT_PUBLIC_APP_URL}/sitemap.xml
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
