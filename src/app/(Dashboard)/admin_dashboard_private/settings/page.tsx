/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import {
  UserCircle,
  ChevronRight,
  ShieldCheck,
  KeyRound,
  Warehouse,
  Users2,
  FileSearch,
  Activity,
  ServerCrash,
} from "lucide-react";
import PageHeader from "@/components/DashboardRelated/PageHeader";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useAppState } from "@/Provider/StateProvider";

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
  const isSuperAdmin = user?.role === "super_admin";

  const SETTINGS_MENU: SettingSection[] = [
    {
      category: "Operations & Logistics",
      items: [
        {
          title: "Warehouse Defaults",
          description:
            "Global restock thresholds and brand metadata configurations.",
          icon: Warehouse,
          href: "#",
          color: "text-slate-400",
          bg: "bg-slate-50",
          status: "Coming Soon",
        },
        {
          title: "System Audit Logs",
          description:
            "Monitor real-time system interactions and ledger updates.",
          icon: FileSearch,
          href: "/admin_dashboard_private/audit-logs",
          color: "text-emerald-600",
          bg: "bg-emerald-50",
        },
      ],
    },
    {
      category: "Organization & Personnel",
      items: [
        {
          title: "Staff Management",
          description: "Manage administrative accounts and system permissions.",
          icon: Users2,
          href: "/admin_dashboard_private/users",
          color: "text-blue-600",
          bg: "bg-blue-50",
        },
        {
          title: "My Profile",
          description:
            "Update your administrative identity and contact details.",
          icon: UserCircle,
          href: "#",
          color: "text-slate-400",
          bg: "bg-slate-50",
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
          href: "/admin_dashboard_private/settings/security",
          color: "text-rose-600",
          bg: "bg-rose-50",
        },
        ...(isSuperAdmin
          ? [
              {
                title: "Master Key Override",
                description:
                  "Critical: Manage primary owner access and core reset protocols.",
                icon: KeyRound,
                href: "/admin_dashboard_private/settings/master-access",
                color: "text-orange-600",
                bg: "bg-orange-50",
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
          color: "text-slate-300",
          bg: "bg-slate-50",
          status: "Restricted",
        },
      ],
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <ServerCrash className="w-10 h-10 text-slate-200 animate-pulse" />
        <div className="text-center font-black text-slate-400 uppercase text-[10px] tracking-[0.3em]">
          Syncing System State...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <PageHeader
        title="Control Center"
        description="Centralized configuration hub for system security and administrative logs."
      />

      <div className="max-w-6xl mx-auto p-6 space-y-12">
        {SETTINGS_MENU.map((section) => (
          <div key={section.category} className="space-y-5">
            <div className="flex items-center gap-4">
              <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 whitespace-nowrap">
                {section.category}
              </h2>
              <div className="h-px w-full bg-slate-100" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {section.items.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className={`group relative flex items-start gap-6 p-6 bg-white border border-slate-200 rounded-3xl transition-all ${
                    item.href === "#"
                      ? "opacity-50 cursor-default"
                      : "hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-100 hover:-translate-y-1 active:scale-[0.98]"
                  } ${item.isCritical ? "border-orange-200 bg-orange-50/20" : ""}`}
                >
                  <div
                    className={`shrink-0 w-16 h-16 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-sm`}
                  >
                    <item.icon className="w-8 h-8" />
                  </div>

                  <div className="flex-1 pr-8">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-black text-slate-800 text-[11px] uppercase tracking-wider">
                        {item.title}
                      </h3>
                      {item.status && (
                        <span className="text-[8px] font-black bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                          {item.status}
                        </span>
                      )}
                      {item.ownerOnly && (
                        <span className="text-[8px] font-black bg-orange-600 text-white px-2 py-0.5 rounded-full uppercase tracking-widest animate-pulse">
                          Super Admin
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {item.href !== "#" && (
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-200 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all">
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
  );
};

export default GlobalSettingsPage;
