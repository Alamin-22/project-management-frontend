"use client";

import { useParams } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import { format } from "date-fns";
import { CalendarDays, Clock, FileText } from "lucide-react";
import { useGetSingleProjectQuery } from "@/Redux/services/projectApi/ProjectApi";

const ProjectOverviewPage = () => {
  const params = useParams();
  const slug = params.slug as string;

  const { data } = useGetSingleProjectQuery(slug, { skip: !slug });
  const project = data?.data;

  if (!project) return null;

  const sanitizedDescription = DOMPurify.sanitize(project.description);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 px-6">
      {/* Left Column: Rich Text Brief */}
      <div className="xl:col-span-2 space-y-6">
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-border pb-4 mb-4">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">
              Project Brief & Resources
            </h2>
          </div>

          <div
            className="prose prose-sm dark:prose-invert max-w-none 
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-lg prose-img:border prose-img:border-border"
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
          />
        </div>
      </div>

      {/* Right Column: Key Details */}
      <div className="space-y-6">
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
            Key Dates
          </h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  Created On
                </p>
                <p className="text-sm font-bold text-foreground">
                  {format(new Date(project.createdAt), "MMMM dd, yyyy")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  Target Deadline
                </p>
                <p className="text-sm font-bold text-foreground">
                  {format(
                    new Date(project.deadline),
                    "MMMM dd, yyyy - hh:mm a",
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectOverviewPage;
