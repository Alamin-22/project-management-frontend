"use client";

import React from "react";
import { usePageTitle } from "@/hooks/usePageTitle";
import PageHeader from "@/components/DashboardRelated/PageHeader";
import { Kanban, Activity, Target, Clock, Lock, Dot } from "lucide-react";
import NotificationBell from "@/components/Shared/Notification/NotificationBell";

interface CardSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const MemberDocumentationPage = () => {
  usePageTitle("Member Documentation | User Manual");

  return (
    <>
      <PageHeader
        title="Member Operations Manual"
        description="A guide to managing your tasks, tracking project progress, and staying productive."
      >
        <NotificationBell />
      </PageHeader>
      <div className="max-w-5xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
        {/* 1. GETTING STARTED */}
        <CardSection
          title="1. Your Dashboard"
          icon={<Target className="w-5 h-5 text-indigo-500" />}
        >
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              Your workspace is your personalized hub. Upon login, the
              <strong>Global Dashboard</strong> provides:
            </p>
            <ul className="space-y-2 list-disc pl-4">
              <li>
                <strong>Task KPIs:</strong> Real-time counts of your pending,
                in-progress, and overdue tasks.
              </li>
              <li>
                <strong>Upcoming Deadlines:</strong> A quick-view list of tasks
                that require your immediate attention.
              </li>
              <li>
                <strong>Project Shortcuts:</strong> Direct links to all projects
                where you are an active team member.
              </li>
            </ul>
          </div>
        </CardSection>

        {/* 2. TASK EXECUTION */}
        <CardSection
          title="2. Task Execution & Workflow"
          icon={<Kanban className="w-5 h-5 text-emerald-500" />}
        >
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>You have dedicated control over your assigned tasks:</p>
            <ul className="space-y-2 list-none">
              <li className="flex gap-2">
                <Dot className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <strong>Status Updates:</strong> Use the Task Board to
                drag-and-drop your tasks through the lifecycle (
                <em>Todo → In-Progress → Completed</em>).
              </li>
              <li className="flex gap-2">
                <Dot className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <strong>Security Restrictions:</strong> You can only modify
                tasks that have been officially assigned to you by a Project
                Manager.
              </li>
              <li className="flex gap-2">
                <Dot className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <strong>Collaboration:</strong> Open any task to view rich-text
                details, attachments, and the comment thread to discuss progress
                with your team.
              </li>
            </ul>
          </div>
        </CardSection>

        {/* 3. PERFORMANCE ANALYTICS */}
        <CardSection
          title="3. Performance & Tracking"
          icon={<Activity className="w-5 h-5 text-blue-500" />}
        >
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              Transparency is key. Under the <strong>Team Analytics</strong> tab
              within any project, you can:
            </p>
            <ul className="space-y-2 list-none">
              <li className="flex gap-2">
                <Dot className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                View your personal task completion percentage.
              </li>
              <li className="flex gap-2">
                <Dot className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                Monitor the progress of your colleagues to understand project
                bottlenecks.
              </li>
            </ul>
          </div>
        </CardSection>

        {/* 4. BEST PRACTICES */}
        <CardSection
          title="4. Productivity Best Practices"
          icon={<Clock className="w-5 h-5 text-amber-500" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-muted rounded-xl border border-border">
              <h4 className="font-bold text-foreground mb-1">Stay Timely</h4>
              <p className="text-muted-foreground text-[11px]">
                Tasks close to your deadline will be highlighted in red or
                amber. Address these first.
              </p>
            </div>
            <div className="p-4 bg-muted rounded-xl border border-border">
              <h4 className="font-bold text-foreground mb-1">
                Update Regularly
              </h4>
              <p className="text-muted-foreground text-[11px]">
                Keep your task status accurate so your Project Manager can rely
                on the live analytics.
              </p>
            </div>
          </div>
        </CardSection>

        {/* SECURITY NOTICE */}
        <div className="bg-muted p-6 rounded-2xl border border-border flex items-center gap-4 text-muted-foreground">
          <Lock className="h-6 w-6 text-primary" />
          <div>
            <h4 className="font-bold text-foreground">Data Privacy</h4>
            <p className="text-xs">
              Your task updates and comments are logged for project
              transparency. Ensure all professional communications comply with
              company policy.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

const CardSection = ({ title, icon, children }: CardSectionProps) => (
  <div className="bg-card border border-border p-6 rounded-2xl">
    <div className="flex items-center gap-2 mb-4">
      {icon}
      <h3 className="font-black uppercase tracking-widest text-foreground text-sm">
        {title}
      </h3>
    </div>
    {children}
  </div>
);

export default MemberDocumentationPage;
