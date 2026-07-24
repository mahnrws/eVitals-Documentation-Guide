import { notFound } from "next/navigation";
import { isValidRole, getRoleLabel, getRoleModulesGrouped, ROLE_GROUPS, type RoleId } from "@/lib/roles";
import { loadAllArticles } from "@/lib/articles-loader";
import { DocsHeader } from "@/components/docs/DocsHeader";
import { ModuleCardGrid } from "@/components/docs/ModuleCardGrid";

export function generateStaticParams() {
  return [
    { role: "super-admin" },
    { role: "system-admin" },
    { role: "practice-admin" },
    { role: "provider" },
    { role: "practice-caregiver" },
    { role: "system-caregiver" },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role: roleParam } = await params;
  if (!isValidRole(roleParam)) return { title: "Not found" };
  return {
    title: `${getRoleLabel(roleParam as RoleId)} Guide — e-Vitals Docs`,
    description: `Step-by-step ${getRoleLabel(roleParam as RoleId)} documentation for eVitals RPM.`,
  };
}

export default async function RoleLandingPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role: roleParam } = await params;

  if (!isValidRole(roleParam)) {
    notFound();
  }

  const role = roleParam as RoleId;
  const articles = loadAllArticles();
  const grouped = getRoleModulesGrouped(role);

  const groupsWithModules = ROLE_GROUPS.filter(
    (group) => grouped[group] && grouped[group].length > 0,
  );

  return (
    <div className="min-h-screen bg-background">
      <DocsHeader role={role} hideSearch />

      <main className="mx-auto max-w-5xl px-4 sm:px-6 pt-12 sm:pt-20 pb-16 sm:pb-20">
        <div className="mb-10 sm:mb-14 text-center">
          <h1 className="text-3xl sm:text-[40px] font-bold tracking-tight text-foreground sm:text-5xl leading-tight">
            Find the guidance you need, fast.
          </h1>
          <p className="mt-4 text-[17px] text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Browse the eVitals RPM documentation in a familiar, structured
            experience designed for quick guidance and easy navigation.
          </p>
        </div>

        <ModuleCardGrid role={role} grouped={grouped} groups={groupsWithModules} articles={articles} />
      </main>

      <footer className="border-t border-border bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-12">
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo.png" alt="e-Vitals" className="h-8" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Documentation for the platform&apos;s core workflows and administration tools.
              </p>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Explore
              </h3>
              <ul className="space-y-2.5">
                {groupsWithModules.slice(0, 4).map((group) => (
                  <li key={group}>
                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                      {group}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Resources
              </h3>
              <ul className="space-y-2.5">
                {groupsWithModules.slice(4).map((group) => (
                  <li key={group}>
                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                      {group}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Role
              </h3>
              <p className="text-sm text-muted-foreground">{getRoleLabel(role)}</p>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} e-Vitals Remote Patient Monitoring. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
