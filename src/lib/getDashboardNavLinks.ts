export interface TNavLink {
  href?: string;
  label?: string;
  heading?: string;
  icon?: string;
}

export const ManagerNavLinks: TNavLink[] = [
  { heading: "Workspace" },
  {
    href: "/manager_workspace",
    label: "Global Dashboard",
    icon: "solar:chart-square-bold-duotone",
  },
  {
    href: "/manager_workspace/projects",
    label: "Projects",
    icon: "solar:folder-with-files-bold-duotone",
  },
  {
    href: "/manager_workspace/projects/archived",
    label: "Archived Projects",
    icon: "solar:archive-bold-duotone",
  },

  { heading: "Administration" },
  {
    href: "/manager_workspace/users",
    label: "Team Members",
    icon: "solar:users-group-two-rounded-bold-duotone",
  },
  {
    href: "/manager_workspace/audit-logs",
    label: "Activity Logs",
    icon: "solar:history-bold-duotone",
  },
  {
    href: "/manager_workspace/documentation",
    label: "Documentations",
    icon: "solar:book-bold-duotone",
  },
  {
    href: "/manager_workspace/settings",
    label: "System Settings",
    icon: "solar:settings-bold-duotone",
  },
];

export const MemberNavLinks: TNavLink[] = [
  { heading: "My Workspace" },
  {
    href: "/member_workspace",
    label: "My Dashboard",
    icon: "solar:chart-square-bold-duotone",
  },
  {
    href: "/member_workspace/projects",
    label: "My Projects",
    icon: "solar:folder-with-files-bold-duotone",
  },
  {
    href: "/member_workspace/projects/archived",
    label: "Archived Projects",
    icon: "solar:archive-bold-duotone",
  },
  { heading: "Account" },
  {
    href: "/member_workspace/documentation",
    label: "Documentations",
    icon: "solar:book-bold-duotone",
  },
  {
    href: "/member_workspace/settings",
    label: "Profile Settings",
    icon: "solar:settings-bold-duotone",
  },
];
