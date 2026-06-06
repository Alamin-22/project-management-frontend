import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";

export interface IBaseResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string;
  data: T;
}

interface CustomFetchArgs extends FetchArgs {
  isPrivate?: boolean;
}

const mutex = new Mutex();
const Url =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_BASE_URL
    : "http://localhost:5000/api/v1";

const baseQuery = fetchBaseQuery({
  baseUrl: Url,
  credentials: "include",
});

const baseQueryWithReauth: BaseQueryFn<
  string | CustomFetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  const isPrivate =
    typeof args === "object" && "isPrivate" in args && args.isPrivate;

  const modifiedArgs: CustomFetchArgs =
    typeof args === "string" ? { url: args } : { ...args };

  if (isPrivate) {
    delete modifiedArgs.isPrivate;
    const accessToken =
      typeof window !== "undefined"
        ? sessionStorage.getItem("accessToken")
        : null;

    if (accessToken) {
      modifiedArgs.headers = {
        ...modifiedArgs.headers,
        Authorization: accessToken,
      };
    }
  }

  let result = await baseQuery(modifiedArgs, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await baseQuery(
          { url: "/auth/refresh-token", method: "POST" },
          api,
          extraOptions,
        );

        if (refreshResult.data) {
          const data = refreshResult.data as IBaseResponse<{
            accessToken: string;
          }>;
          const newAccessToken = data.data.accessToken;

          sessionStorage.setItem("accessToken", newAccessToken);

          modifiedArgs.headers = {
            ...modifiedArgs.headers,
            Authorization: newAccessToken,
          };
          result = await baseQuery(modifiedArgs, api, extraOptions);
        } else {
          sessionStorage.removeItem("accessToken");
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      const token = sessionStorage.getItem("accessToken") || "";
      modifiedArgs.headers = { ...modifiedArgs.headers, Authorization: token };
      result = await baseQuery(modifiedArgs, api, extraOptions);
    }
  }

  return result;
};

const baseApi = createApi({
  reducerPath: "BaseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Users",
    "Projects",
    "Tasks",
    "TaskComments",
    "Dashboard",
    "AuditLog",
    "Notifications",
  ],
  endpoints: () => ({}),
});

export default baseApi;
