export interface TNavLink {
  href?: string;
  label?: string;
  heading?: string;
  icon?: string;
}

export const AdminNavbarLinks: TNavLink[] = [
  { heading: "Insights" },
  {
    href: "/admin_dashboard_private",
    label: "Analytical Dashboard",
    icon: "solar:chart-square-bold-duotone",
  },
  {
    href: "/admin_dashboard_private/audit-logs",
    label: "Activity Log Feed",
    icon: "solar:history-bold-duotone",
  },

  { heading: "Inventory Control" },
  {
    href: "/admin_dashboard_private/products",
    label: "Product Catalog",
    icon: "solar:box-bold-duotone",
  },
  {
    href: "/admin_dashboard_private/categories",
    label: "Categories",
    icon: "solar:tag-bold-duotone",
  },

  { heading: "Sales Operations" },
  {
    href: "/admin_dashboard_private/orders",
    label: "Order Management",
    icon: "solar:cart-large-2-bold-duotone",
  },
  {
    href: "/admin_dashboard_private/payments",
    label: "Financial Ledger",
    icon: "solar:wallet-money-bold-duotone",
  },

  { heading: "System & Staff" },
  {
    href: "/admin_dashboard_private/users",
    label: "Staff Management",
    icon: "solar:shield-user-bold-duotone",
  },
  {
    href: "/admin_dashboard_private/settings",
    label: "System Settings",
    icon: "solar:settings-bold-duotone",
  },
];
