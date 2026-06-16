import { redirect } from "next/navigation";

// Redirect /app → /app/dashboard
export default function AppRoot() {
  redirect("/app/dashboard");
}
