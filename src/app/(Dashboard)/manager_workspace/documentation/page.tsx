"use client";

import { usePageTitle } from "@/hooks/usePageTitle";
import PageHeader from "@/components/DashboardRelated/PageHeader";
import {
  BookOpen,
  ShieldCheck,
  Kanban,
  Activity,
  AlertTriangle,
} from "lucide-react";
import NotificationBell from "@/components/Shared/Notification/NotificationBell";

interface CardSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const ManagerDocumentationPage = () => {
  usePageTitle("Manager Documentation | Ops Manual");

  return (
    <>
      <PageHeader
        title="Manager Operations Manual"
        description="A comprehensive guide to managing the project lifecycle, team productivity, and system security."
      >
        <NotificationBell />
      </PageHeader>
      <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
        <CardSection
          title="1. Getting Started & Dashboard"
          icon={<BookOpen className="w-5 h-5 text-indigo-500" />}
        >
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              Upon logging in, you are greeted by the{" "}
              <strong>Manager Dashboard</strong>. The purpose of this interface
              is to provide a 30,000-foot view of your entire organization.
            </p>
            <ul className="space-y-2">
              <li>
                • <strong>Global KPIs:</strong> Real-time tracking of total
                projects, tasks, and overdue items.
              </li>
              <li>
                • <strong>Navigation:</strong> Use the sidebar to toggle between
                project management, user management, and security audit logs.
              </li>
              <li>
                • <strong>Workflow Philosophy:</strong> This system is
                project-oriented. <em>Projects act as the root container.</em>{" "}
                All tasks, team members, and comments live inside the project
                context.
              </li>
            </ul>
          </div>
        </CardSection>

        {/* how it works */}
        <CardSection
          title="2. Project Lifecycle & Management"
          icon={<Kanban className="w-5 h-5 text-emerald-500" />}
        >
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              The lifecycle begins at the <strong>Projects</strong> hub:
            </p>
            <ol className="space-y-2 list-decimal list-inside">
              <li>
                <strong>Creation:</strong> Initialize via the <em>Create</em>{" "}
                button. Provide a deadline; the system enforces strict date
                validation.
              </li>
              <li>
                <strong>The Overview Hub:</strong> Click any project to enter
                its workspace. You will see these tabs:
              </li>
            </ol>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <TabInfo name="Overview" desc="Summary and project status." />
              <TabInfo
                name="Task Board"
                desc="Kanban interface for task management."
              />
              <TabInfo name="Team" desc="Manage members and project silos." />
              <TabInfo
                name="Analytics"
                desc="Performance metrics per member."
              />
            </div>
          </div>
        </CardSection>

        <CardSection
          title="3. Advanced Task Board"
          icon={<Kanban className="w-5 h-5 text-amber-500" />}
        >
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>The Task Board is the operational heart of the system:</p>
            <ul className="space-y-2">
              <li>
                • <strong>DnD (Drag-and-Drop):</strong> Seamlessly move tasks
                between columns. The system auto-updates the task order and
                status.
              </li>
              <li>
                • <strong>Restrictions:</strong> Unauthorized users (Team
                Members) are blocked from editing tasks not assigned to them via
                UI-locking and backend validation.
              </li>
              <li>
                • <strong>Content:</strong> Every task supports Rich-Text
                (Tiptap) descriptions and file attachments.
              </li>
              <li>
                • <strong>Comments:</strong> Use the comments section inside
                tasks to maintain team communication history.
              </li>
              <li>
                • <strong>Archiving:</strong> Tasks can be archived when
                completed to keep the board clean.
              </li>
            </ul>
          </div>
        </CardSection>

        <CardSection
          title="4. Security & Accountability"
          icon={<ShieldCheck className="w-5 h-5 text-rose-500" />}
        >
          <div className="space-y-4">
            <div className="bg-destructive/10 p-4 rounded-xl border border-destructive/20 text-destructive text-sm flex gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <p>
                <strong>Strict Audit Policy:</strong> All state changes (Task
                updates, member additions, deletions) are logged. You can view
                these via the <em>Audit Logs</em> in the settings.
              </p>
            </div>
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted text-muted-foreground uppercase font-bold">
                  <tr>
                    <th className="p-3">Role</th>
                    <th className="p-3">Permissions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="p-3 font-bold">Admin/PM</td>
                    <td className="p-3">Full CRUD & System Audits</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">Member</td>
                    <td className="p-3">Update assigned tasks only</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CardSection>

        <CardSection
          title="5. Analytics & Productivity"
          icon={<Activity className="w-5 h-5 text-blue-500" />}
        >
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Performance is tracked through:</p>
            <ul className="space-y-1">
              <li>
                • <strong>Team Analytics:</strong> See real-time progress bars
                for each member based on their `Todo` vs `Done` task count.
              </li>
              <li>
                • <strong>Global KPIs:</strong> Monitor overdue vs pending tasks
                to manage bottleneck risks.
              </li>
            </ul>
          </div>
        </CardSection>
      </div>
    </>
  );
};

const CardSection = ({ title, icon, children }: CardSectionProps) => (
  <div className="bg-card border border-border p-6 rounded-2xl shadow-xs">
    <div className="flex items-center gap-2 mb-4">
      {icon}
      <h3 className="font-black uppercase tracking-widest text-foreground text-sm">
        {title}
      </h3>
    </div>
    {children}
  </div>
);

const TabInfo = ({ name, desc }: { name: string; desc: string }) => (
  <div className="bg-muted/50 p-3 rounded-lg border border-border">
    <p className="font-bold text-foreground text-xs">{name}</p>
    <p className="text-[10px] text-muted-foreground">{desc}</p>
  </div>
);

export default ManagerDocumentationPage;
