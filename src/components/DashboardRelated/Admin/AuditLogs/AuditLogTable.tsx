"use client";

import { useState } from "react";
import { format } from "date-fns";
import { FileJson, Eye, Activity } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import QueryNotFoundMessage from "@/components/Shared/QueryNotFoundMessage";
import AuditLogDetailsModal from "./AuditLogDetailsModal";
import TableSkeleton from "@/components/Shared/Loader/TableSkeleton";
import { IAuditLog } from "@/Redux/services/auditApi/AuditLog.interface";

interface AuditLogTableProps {
  logs: IAuditLog[] | undefined;
  isLoading: boolean;
  startIndex: number;
}

const AuditLogTable = ({ logs, isLoading, startIndex }: AuditLogTableProps) => {
  const [selectedLog, setSelectedLog] = useState<IAuditLog | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleViewDetails = (log: IAuditLog) => {
    setSelectedLog(log);
    setIsDetailsOpen(true);
  };

  const getStatusStyle = (status: number) => {
    if (status >= 200 && status < 300)
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (status >= 400 && status < 500)
      return "bg-amber-50 text-amber-700 border-amber-200";
    if (status >= 500)
      return "bg-destructive/10 text-destructive border-destructive/20";
    return "bg-muted text-muted-foreground border-border";
  };

  const getActionBadge = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes("delete"))
      return "bg-destructive/10 text-destructive border-destructive/20";
    if (act.includes("create") || act.includes("add"))
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    if (act.includes("update") || act.includes("edit"))
      return "bg-blue-50 text-blue-700 border-blue-200";
    return "bg-muted text-muted-foreground border-border";
  };

  return (
    <>
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-14 text-center text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                #
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Operator
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Event Action
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Resource
              </TableHead>
              <TableHead className="text-center text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Timestamp
              </TableHead>
              <TableHead className="w-24 text-right pr-6 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                View
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton columns={7} rows={10} />
            ) : logs?.length ? (
              logs.map((log, idx) => (
                <TableRow
                  key={log._id}
                  className="border-b border-border/50 hover:bg-muted/30"
                >
                  <TableCell className="text-center font-mono text-[10px] text-muted-foreground">
                    {(startIndex + idx + 1).toString().padStart(2, "0")}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-foreground leading-tight">
                        {log.email.split("@")[0]}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {log.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`px-1.5 py-0 font-mono text-[10px] uppercase border ${getActionBadge(log.action)}`}
                    >
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Activity className="w-3 h-3 opacity-50" />
                      <span className="text-xs font-bold capitalize">
                        {log.resource}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={`rounded-md font-bold text-[10px] px-2 py-0.5 border shadow-none hover:opacity-80 ${getStatusStyle(log.status)}`}
                    >
                      {log.status} {log.status >= 400 ? "ERR" : "OK"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[11px] text-muted-foreground font-medium whitespace-nowrap">
                    {format(new Date(log.createdAt), "MMM dd • HH:mm:ss")}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all rounded-lg"
                      onClick={() => handleViewDetails(log)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-64 text-center">
                  <QueryNotFoundMessage message="No activity logs found for this search." />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-4xl! w-[95vw] p-0 overflow-hidden border-border rounded-2xl  z-200 grid grid-rows-[auto_1fr] max-h-[90vh]">
          <DialogHeader className="px-8 py-6 border-b border-border bg-card shrink-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <FileJson className="h-6 w-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black text-foreground tracking-tight">
                  Technical Log Analysis
                </DialogTitle>
                <DialogDescription className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Log Reference:{" "}
                  <span className="font-mono text-primary">
                    {selectedLog?._id}
                  </span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="bg-muted/30 overflow-y-auto custom-scrollbar">
            {selectedLog && <AuditLogDetailsModal log={selectedLog} />}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AuditLogTable;
