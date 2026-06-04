import baseApi, { IBaseResponse } from "@/Redux/api/baseApi";
import {
  IAuthResponse,
  IChangePasswordRequest,
  IForgotPasswordRequest,
  ILoginCredentials,
  IResetPasswordRequest,
  IMasterEmailChangeRequest,
  IMasterEmailChangeResponse,
} from "./Auth.interface";
import { IUser } from "../userApi/User.interface";

export const AuthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<IAuthResponse, ILoginCredentials>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data?.accessToken) {
            sessionStorage.setItem("accessToken", data.data.accessToken);
          }
          dispatch(baseApi.util.resetApiState());
        } catch (err) {
          console.error("Login failed:", err);
        }
      },
    }),

    getMe: builder.query<IBaseResponse<IUser>, void>({
      query: () => ({
        url: "/auth/get-me",
        method: "GET",
        isPrivate: true,
      }),
      providesTags: [{ type: "Users", id: "get_me" }],
    }),

    // Clears cookie on backend and session locally
    logout: builder.mutation<IBaseResponse<null>, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
        isPrivate: true,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          sessionStorage.removeItem("accessToken");
          dispatch(baseApi.util.resetApiState());
        } catch (error) {
          console.error("Logout process failed:", error);
        }
      },
    }),

    // Forget Password
    forgetPassword: builder.mutation<
      IBaseResponse<null>,
      IForgotPasswordRequest
    >({
      query: (body) => ({
        url: "/auth/forget-password",
        method: "POST",
        body,
      }),
    }),

    // Reset Password (Token in Header)
    resetPassword: builder.mutation<IBaseResponse<null>, IResetPasswordRequest>(
      {
        query: ({ token, body }) => ({
          url: "/auth/reset-password",
          method: "POST",
          headers: {
            Authorization: token,
          },
          body,
        }),
      },
    ),

    // Change Password (Authenticated)
    changePassword: builder.mutation<
      IBaseResponse<null>,
      IChangePasswordRequest
    >({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
        isPrivate: true,
      }),
    }),

    // Master Key: Owner Handover (Email Change)
    updateMasterEmail: builder.mutation<
      IBaseResponse<IMasterEmailChangeResponse>,
      IMasterEmailChangeRequest
    >({
      query: (data) => ({
        url: "/auth/secure/master-email-change",
        method: "PATCH",
        body: data,
        isPrivate: true,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.success) {
            sessionStorage.removeItem("accessToken");
            dispatch(baseApi.util.resetApiState());
          }
        } catch (err) {
          console.error("Master Email Change failed:", err);
        }
      },
    }),
  }),
});

export const {
  useGetMeQuery,
  useLoginMutation,
  useLogoutMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useUpdateMasterEmailMutation,
} = AuthApi;
