export type RoleId =
  | "super-admin"
  | "system-admin"
  | "practice-admin"
  | "provider"
  | "practice-caregiver"
  | "system-caregiver";

export interface RoleModule {
  key: string;
  docTitle: string;
  group: string;
  articleId: string;
}

export const ROLES: { id: RoleId; label: string }[] = [
  { id: "super-admin", label: "Super Admin" },
  { id: "system-admin", label: "System Admin" },
  { id: "practice-admin", label: "Practice Admin" },
  { id: "provider", label: "Provider" },
  { id: "practice-caregiver", label: "Practice Caregiver" },
  { id: "system-caregiver", label: "System Caregiver" },
];

export const ROLE_GROUPS = [
  "Getting Started",
  "Practice Operations",
  "User Management",
  "Patient Care",
  "Configuration",
  "Communication",
] as const;

function m(role: RoleId, key: string, docTitle: string, group: string): RoleModule {
  return { key, docTitle, group, articleId: `${role}-${key}` };
}

export const ROLE_CONFIGS: Record<RoleId, RoleModule[]> = {
  "super-admin": [
    m("super-admin", "getting-started", "Getting Started", "Getting Started"),
    m("super-admin", "super-admin-dashboard", "Super Admin Dashboard", "Practice Operations"),
    m("super-admin", "practice-list", "Practice List", "Practice Operations"),
    m("super-admin", "enrollment", "Enrollment", "Practice Operations"),
    m("super-admin", "admins-system-admins", "Admins (System Admins)", "User Management"),
    m("super-admin", "caregivers-system-caregivers", "Caregivers (System Caregivers)", "User Management"),
    m("super-admin", "inventory", "Inventory", "Configuration"),
    m("super-admin", "billing", "Billing", "Configuration"),
    m("super-admin", "patient-management", "Patient Management", "Patient Care"),
    m("super-admin", "care-management", "Care Management", "Patient Care"),
    m("super-admin", "calendar", "Calendar", "Configuration"),
    m("super-admin", "programs", "Programs", "Configuration"),
    m("super-admin", "permission", "Permission", "Configuration"),
    m("super-admin", "email-logs", "Email Logs", "Configuration"),
    m("super-admin", "mobile-app-access", "Mobile App Access", "Configuration"),
  ],
  "system-admin": [
    m("system-admin", "getting-started", "Getting Started", "Getting Started"),
    m("system-admin", "system-admin-dashboard", "System Admin Dashboard", "Practice Operations"),
    m("system-admin", "practice-detail", "Practice Detail", "Practice Operations"),
    m("system-admin", "caregivers", "Caregivers", "User Management"),
    m("system-admin", "inventory", "Inventory", "Configuration"),
    m("system-admin", "billing-reports", "Billing Reports", "Configuration"),
    m("system-admin", "patient-management", "Patient Management", "Patient Care"),
    m("system-admin", "care-management", "Care Management", "Patient Care"),
    m("system-admin", "calendar", "Calendar", "Configuration"),
    m("system-admin", "programs", "Programs", "Configuration"),
    m("system-admin", "settings", "Settings", "Configuration"),
    m("system-admin", "permission-role-based-access", "Permission (Role-Based Access)", "Configuration"),
  ],
  "practice-admin": [
    m("practice-admin", "getting-started", "Getting Started", "Getting Started"),
    m("practice-admin", "dashboard-practice-landing", "Dashboard (Practice Landing)", "Practice Operations"),
    m("practice-admin", "practice-tab", "Practice Tab", "Practice Operations"),
    m("practice-admin", "admins-tab", "Admins Tab", "User Management"),
    m("practice-admin", "providers-tab", "Providers Tab", "User Management"),
    m("practice-admin", "caregivers-tab", "Caregivers Tab", "User Management"),
    m("practice-admin", "patients-tab", "Patients Tab", "Patient Care"),
    m("practice-admin", "system-caregivers-tab", "System Caregivers Tab", "User Management"),
    m("practice-admin", "rpm-tab", "RPM Tab", "Patient Care"),
    m("practice-admin", "schedule-targets-tab", "Schedule & Targets Tab", "Patient Care"),
    m("practice-admin", "import-patients-tab", "Import Patients Tab", "Patient Care"),
    m("practice-admin", "patient-management", "Patient Management", "Patient Care"),
    m("practice-admin", "care-management", "Care Management", "Patient Care"),
    m("practice-admin", "calendar", "Calendar", "Configuration"),
    m("practice-admin", "messages", "Messages", "Communication"),
    m("practice-admin", "settings", "Settings", "Configuration"),
  ],
  provider: [
    m("provider", "getting-started", "Getting Started", "Getting Started"),
    m("provider", "dashboard", "Dashboard", "Practice Operations"),
    m("provider", "practice-detail-tabbed-workspace", "Practice Detail (Tabbed Workspace)", "Practice Operations"),
    m("provider", "patient-management", "Patient Management", "Patient Care"),
    m("provider", "care-management", "Care Management", "Patient Care"),
    m("provider", "calendar", "Calendar", "Configuration"),
    m("provider", "messages", "Messages", "Communication"),
    m("provider", "settings", "Settings", "Configuration"),
  ],
  "practice-caregiver": [
    m("practice-caregiver", "getting-started", "Getting Started", "Getting Started"),
    m("practice-caregiver", "dashboard", "Dashboard", "Practice Operations"),
    m("practice-caregiver", "patient-management", "Patient Management", "Patient Care"),
    m("practice-caregiver", "care-management", "Care Management", "Patient Care"),
    m("practice-caregiver", "messages", "Messages", "Communication"),
    m("practice-caregiver", "settings", "Settings", "Configuration"),
  ],
  "system-caregiver": [
    m("system-caregiver", "getting-started", "Getting Started", "Getting Started"),
    m("system-caregiver", "practice", "Practice", "Practice Operations"),
    m("system-caregiver", "patient-management", "Patient Management", "Patient Care"),
    m("system-caregiver", "care-management", "Care Management", "Patient Care"),
    m("system-caregiver", "messages", "Messages", "Communication"),
    m("system-caregiver", "settings", "Settings", "Configuration"),
  ],
};

export function isValidRole(r: string): r is RoleId {
  return ROLES.some((x) => x.id === r);
}

export function getRoleLabel(r: RoleId): string {
  return ROLES.find((x) => x.id === r)?.label ?? r;
}

export function getRoleModules(r: RoleId): RoleModule[] {
  return ROLE_CONFIGS[r] ?? [];
}

export function getRoleModulesGrouped(r: RoleId): Record<string, RoleModule[]> {
  const grouped: Record<string, RoleModule[]> = {};
  for (const g of ROLE_GROUPS) grouped[g] = [];
  for (const mod of getRoleModules(r)) {
    (grouped[mod.group] ??= []).push(mod);
  }
  return grouped;
}
