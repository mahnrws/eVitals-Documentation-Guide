import { notFound } from "next/navigation";
import { isValidRole, type RoleId } from "@/lib/roles";

export default function DocsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ role: string }>;
}) {
  // We need to validate the role at the layout level.
  // Since this is a server component, we can validate synchronously.
  // However, params is a Promise in Next.js 15+.
  // We'll handle validation in the page components instead.
  return <>{children}</>;
}
