import baseApi, { IBaseResponse } from "../../api/baseApi";

export interface ICloudinaryResource {
  url: string;
  publicId: string;
}

export const uploaderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadMedia: builder.mutation<
      IBaseResponse<ICloudinaryResource[]>,
      FormData
    >({
      query: (formData) => ({
        url: "/media/upload",
        method: "POST",
        body: formData,
        isPrivate: true,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useUploadMediaMutation } = uploaderApi;
