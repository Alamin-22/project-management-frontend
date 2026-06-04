export interface IQueryParams {
  // --- 1. Pagination (Matched to .paginate()) ---
  page?: number;
  limit?: number;

  // --- 2. Sorting & Search (Matched to .sort() & .search()) ---
  // Format: "-createdAt" or "name,price"
  sort?: string;
  // Text for the regex search
  search?: string;

  // --- 3. Field Selection (Matched to .limitFields()) ---
  // Format: "name,email" or "-password"
  fields?: string; // Backend accepts 'fields' or 'limitFields'

  // --- 4. Special System Flags (Matched to .filter()) ---
  // These are explicitly checked in your filter method
  withDeleted?: boolean;
  withGroupBuy?: boolean;

  // --- 5. Dynamic Filters (The "Smart Hybrid" Logic) ---
  // Your backend parses operators like gte, lt, in, regex automatically.
  // Example: { price: { gte: 100 }, category: "id1,id2" }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: string | number | boolean | undefined | Record<string, any>;
}
export interface IQueryMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
