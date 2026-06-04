import { IBaseResponse } from "@/Redux/api/baseApi";

export type TComparisonMetric = {
  current: number;
  previous: number;
  change: number;
};

export interface IDueOrder {
  orderId: string;
  customerName: string;
  amountDue: number;
}

export interface IInventoryAlerts {
  totalVariants: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export interface IDashboardSummary {
  netRevenue: TComparisonMetric;
  grossSales: TComparisonMetric;
  orderCount: TComparisonMetric;
  inventoryAlerts: IInventoryAlerts;
  statusCounts: Record<string, number>;
  topDebtors: IDueOrder[];
}

export interface IRestockItem {
  productId: string;
  productTitle: string;
  variantName: string;
  sku: string;
  currentStock: number;
  threshold: number;
  category: string;
  priority: "High" | "Medium" | "Low";
}

export type TDashboardSummaryResponse = IBaseResponse<IDashboardSummary>;
export type TRestockQueueResponse = IBaseResponse<IRestockItem[]>;
