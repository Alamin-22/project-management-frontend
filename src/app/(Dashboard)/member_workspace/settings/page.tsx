"use client";

import Link from "next/link";
import { UserCircle, ChevronRight, ShieldCheck, Activity } from "lucide-react";
import PageHeader from "@/components/DashboardRelated/PageHeader";
import { usePageTitle } from "@/hooks/usePageTitle";
import NotificationBell from "@/components/Shared/Notification/NotificationBell";

const MemberSettingsPage = () => {
  usePageTitle("Account Settings");

  const SETTINGS_MENU = [
    {
      category: "My Account",
      items: [
        {
          title: "My Profile",
          description:
            "Update your name, designation, and contact information.",
          icon: UserCircle,
          href: "#",
          color: "text-blue-600",
          bg: "bg-blue-500/10",
          status: "Under Maintenance",
        },
        {
          title: "Security & Password",
          description: "Change your password and manage account security.",
          icon: ShieldCheck,
          href: "/member_workspace/settings/security",
          color: "text-rose-600",
          bg: "bg-rose-500/10",
        },
      ],
    },
    {
      category: "System Access",
      items: [
        {
          title: "Team Analytics",
          description: "View project performance metrics and team workload.",
          icon: Activity,
          href: "/member_workspace/projects",
          color: "text-emerald-600",
          bg: "bg-emerald-500/10",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen pb-20">
      <PageHeader
        title="Account Settings"
        description="Manage your security credentials and personal information."
      >
        <NotificationBell />
      </PageHeader>

      <div className="px-6 space-y-12 mt-10">
        {SETTINGS_MENU.map((section) => (
          <div key={section.category} className="space-y-5">
            <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground">
              {section.category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {section.items.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className={`group relative flex items-start gap-6 p-6 bg-card border border-border rounded-3xl transition-all ${
                    item.href === "#"
                      ? "opacity-50 cursor-default"
                      : "hover:border-primary/50 hover:shadow-lg hover:-translate-y-1"
                  }`}
                >
                  <div
                    className={`shrink-0 w-16 h-16 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center`}
                  >
                    <item.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-black text-foreground text-[11px] uppercase tracking-wider">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {item.description}
                    </p>
                  </div>
                  {item.href !== "#" && (
                    <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-hover:text-primary" />
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

export default MemberSettingsPage;
