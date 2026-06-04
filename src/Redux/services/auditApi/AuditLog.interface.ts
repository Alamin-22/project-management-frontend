/* eslint-disable @typescript-eslint/no-explicit-any */

import { IQueryMeta } from "@/app/types/common";

export interface IAuditLog {
  _id: string;
  userId: string;
  email: string;
  role: string;
  action: string;
  resource: string;
  payload: any;
  status: number;
  ip: string;
  userAgent: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAuditLogResponse {
  success: boolean;
  message: string;
  data: {
    meta: IQueryMeta;
    result: IAuditLog[];
  };
}
