import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getSiteById } from "@/server/services/siteService";
import { Sidebar } from "@/components/admin/Sidebar";
import { Topbar } from "@/components/admin/Topbar";

interface SiteLayoutProps {
  children: React.ReactNode;
  params: Promise<{ siteId: string }>;
}

export default async function SiteLayout({ children, params }: SiteLayoutProps) {
  const { siteId } = await params;
  const session = await getSession();
  if (!session) redirect("/login");

  const site = await getSiteById(siteId, session.user.workspaceId);
  if (!site) notFound();

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Sidebar siteId={site.id} siteName={site.name} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Topbar
          user={session.user}
          breadcrumbs={[
            { label: "Sites", href: "/app/sites" },
            { label: site.name },
          ]}
        />
        <main style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
