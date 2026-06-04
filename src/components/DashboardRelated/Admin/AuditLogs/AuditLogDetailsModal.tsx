"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Globe,
  Clock,
  User,
  Fingerprint,
  Copy,
  Check,
  Monitor,
  Terminal,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IAuditLog } from "@/Redux/services/auditApi/AuditLog.interface";
import toast from "react-hot-toast";

const AuditLogDetailsModal = ({ log }: { log: IAuditLog }) => {
  const [isCopied, setIsCopied] = useState(false);
  const jsonString = log.payload ? JSON.stringify(log.payload, null, 2) : "{}";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setIsCopied(true);
      toast.success("Payload copied", { style: { fontSize: "12px" } });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* 1. METADATA GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "IP Address",
            value: log.ip,
            icon: Globe,
            color: "text-blue-500",
          },
          {
            label: "Event Time",
            value: format(new Date(log.createdAt), "HH:mm:ss"),
            icon: Clock,
            color: "text-amber-500",
          },
          {
            label: "Admin Role",
            value: log.role,
            icon: User,
            color: "text-emerald-500",
          },
          {
            label: "User ID",
            value: log.userId,
            icon: Fingerprint,
            color: "text-indigo-500",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {item.label}
              </span>
            </div>
            <p className="text-xs font-mono font-bold text-slate-700 truncate bg-slate-50 px-2 py-1 rounded-lg">
              {item.value || "N/A"}
            </p>
          </div>
        ))}
      </div>

      {/* 2. USER AGENT */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-100 group-hover:bg-indigo-50 transition-colors" />
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2.5">
            <Monitor className="w-4 h-4 text-slate-500" />
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
              Client User Agent
            </span>
          </div>
          <Badge
            variant="outline"
            className="text-[10px] font-mono font-bold text-slate-400"
          >
            {format(new Date(log.createdAt), "PPP")}
          </Badge>
        </div>
        <p className="text-[12px] text-slate-600 leading-relaxed italic bg-slate-50/50 p-4 rounded-xl border border-slate-100 font-mono break-all">
          {log.userAgent}
        </p>
      </div>

      {/* 3. PAYLOAD VIEW */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5">
            <Terminal className="w-4 h-4 text-indigo-500" />
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
              Inbound Payload
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className={`h-8 gap-2 rounded-lg font-bold text-[10px] uppercase ${isCopied ? "text-emerald-600" : ""}`}
          >
            {isCopied ? (
              <Check className="w-3 h-3" />
            ) : (
              <Copy className="w-3 h-3" />
            )}{" "}
            {isCopied ? "Copied" : "Copy JSON"}
          </Button>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#1e1e1e] shadow-2xl">
          <div className="w-full h-10 bg-[#2d2d2d] border-b border-[#404040] flex items-center px-5 gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500 ml-4" />
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
              payload.json
            </span>
          </div>

          <div className="p-2">
            <SyntaxHighlighter
              language="json"
              style={vscDarkPlus}
              wrapLongLines={true}
              customStyle={{
                margin: 0,
                padding: "1.5rem",
                background: "transparent",
                fontSize: "13px",
                lineHeight: "1.6",
              }}
            >
              {jsonString}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogDetailsModal;
