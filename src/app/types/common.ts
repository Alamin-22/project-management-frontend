export interface IQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  fields?: string;
  withDeleted?: boolean;
  status?: "active" | "blocked";
  role?: "admin" | "project_manager" | "team_member";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: string | number | boolean | undefined | Record<string, any>;
}

export interface IQueryMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IPaginatedResponse<T> {
  meta: IQueryMeta;
  result: T[];
}
