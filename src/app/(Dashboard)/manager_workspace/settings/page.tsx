/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import {
  UserCircle,
  ChevronRight,
  ShieldCheck,
  KeyRound,
  LayoutTemplate,
  Users2,
  FileSearch,
  Activity,
} from "lucide-react";
import PageHeader from "@/components/DashboardRelated/PageHeader";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useAppState } from "@/Provider/StateProvider";
import NotificationBell from "@/components/Shared/Notification/NotificationBell";
import LogoLoader from "@/components/Shared/Loader/LogoLoader";
import { USER_ROLE } from "@/Redux/services/userApi/User.interface";

interface SettingItem {
  title: string;
  description: string;
  icon: any;
  href: string;
  color: string;
  bg: string;
  status?: string;
  isCritical?: boolean;
  ownerOnly?: boolean;
}

interface SettingSection {
  category: string;
  items: SettingItem[];
}

const GlobalSettingsPage = () => {
  usePageTitle("System Configuration");

  const { user, loading } = useAppState();
  const isSuperAdmin = user?.role === USER_ROLE.super_admin;

  const SETTINGS_MENU: SettingSection[] = [
    {
      category: "Workspace Configuration",
      items: [
        {
          title: "Workspace Preferences",
          description:
            "Global project defaults, notification rules, and workspace metadata.",
          icon: LayoutTemplate,
          href: "#",
          color: "text-slate-400",
          bg: "bg-muted",
          status: "Coming Soon",
        },
        {
          title: "System Audit Logs",
          description:
            "Monitor real-time system interactions, task updates, and security events.",
          icon: FileSearch,
          href: "/manager_workspace/audit-logs",
          color: "text-emerald-600",
          bg: "bg-emerald-500/10",
        },
      ],
    },
    {
      category: "Organization & Personnel",
      items: [
        {
          title: "Team Management",
          description: "Manage member accounts, roles, and system permissions.",
          icon: Users2,
          href: "/manager_workspace/users",
          color: "text-blue-600",
          bg: "bg-blue-500/10",
        },
        {
          title: "My Profile",
          description:
            "Update your administrative identity and contact details.",
          icon: UserCircle,
          href: "#",
          color: "text-slate-400",
          bg: "bg-muted",
          status: "Under Maintenance",
        },
      ],
    },
    {
      category: "Security & Infrastructure",
      items: [
        {
          title: "Access Security",
          description:
            "Change your password and manage account security sessions.",
          icon: ShieldCheck,
          href: "/manager_workspace/settings/security",
          color: "text-rose-600",
          bg: "bg-rose-500/10",
        },
        ...(isSuperAdmin
          ? [
              {
                title: "Master Key Override",
                description:
                  "Critical: Manage primary owner access and core reset protocols.",
                icon: KeyRound,
                href: "/manager_workspace/settings/master-access",
                color: "text-orange-600",
                bg: "bg-orange-500/10",
                isCritical: true,
                ownerOnly: true,
              },
            ]
          : []),
        {
          title: "System Health",
          description: "Database indexing and API health monitoring.",
          icon: Activity,
          href: "#",
          color: "text-slate-400",
          bg: "bg-muted",
          status: "Restricted",
        },
      ],
    },
  ];

  if (loading) {
    return <LogoLoader />;
  }

  return (
    <>
      <PageHeader
        title="Control Center"
        description="Centralized configuration hub for system security and administrative logs."
      >
        <NotificationBell />
      </PageHeader>
      <div className="p-10">
        <div className=" space-y-12">
          {SETTINGS_MENU.map((section, idx) => (
            <div key={idx} className="space-y-5">
              <div className="flex items-center gap-4">
                <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground whitespace-nowrap">
                  {section.category}
                </h2>
                <div className="h-px w-full bg-border" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {section.items.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className={`group relative flex items-start gap-6 p-6 bg-card border rounded-3xl transition-all ${
                      item.href === "#"
                        ? "opacity-50 cursor-default border-border"
                        : "border-border hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 active:scale-[0.98]"
                    } ${item.isCritical ? "border-orange-500/30 bg-orange-500/5" : ""}`}
                  >
                    <div
                      className={`shrink-0 w-16 h-16 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-sm`}
                    >
                      <item.icon className="w-8 h-8" />
                    </div>

                    <div className="flex-1 pr-8">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-black text-foreground text-[11px] uppercase tracking-wider">
                          {item.title}
                        </h3>
                        {item.status && (
                          <span className="text-[8px] font-black bg-muted text-muted-foreground px-2 py-0.5 rounded-full uppercase tracking-tighter">
                            {item.status}
                          </span>
                        )}
                        {item.ownerOnly && (
                          <span className="text-[8px] font-black bg-orange-600 text-white px-2 py-0.5 rounded-full uppercase tracking-widest animate-pulse">
                            Super Admin
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {item.href !== "#" && (
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default GlobalSettingsPage;
