import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Product } from '../../interfaces/product/Product';
import { Pathes } from '../Pathes';
import { UserPrivateProductEstimates } from '../../interfaces/product/UserPrivateProductEstimates';
import { UserProfile } from '../../interfaces/user/UserProfile';
import { SaveReview } from '../../interfaces/product/SaveReview';
import { Reaction } from '../../interfaces/product/Reaction';
import { Report } from '../../interfaces/product/Report';
import { Review } from '../../interfaces/product/Review';
import { UniqueDeveloper } from '../../interfaces/product/UniqueDeveloper';

const productApi = createApi({
  reducerPath: 'products',
  baseQuery: fetchBaseQuery({
    baseUrl: Pathes.mainPath,
  }),
  tagTypes: ['Product', 'PrivateEstimates', 'Report', 'Review'],
  endpoints: (builder) => ({
    getAllProducts: builder.query<Product[], string>({
      query: (type) => {
        return {
          url: `${Pathes.publicPath}/${type}s`,
          method: 'GET',
        };
      },
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.map((p) => ({ type: 'Product' as const, id: p.id })),
              'Product',
            ]
          : ['Product'],
    }),

    deleteProduct: builder.mutation<void, { productId: number; token: string }>(
      {
        query: ({ productId, token }) => {
          return {
            url: `RateThis-product/${productId}`,
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
            credentials: 'include',
          };
        },
        invalidatesTags: (result, error, arg) => ['Product'],
      }
    ),

    deleteDeveloper: builder.mutation<
      void,
      { developerId: number; token: string }
    >({
      query: ({ developerId, token }) => {
        return {
          url: `RateThis-product/developer/${developerId}`,
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
        };
      },
    }),

    getAllProductReviews: builder.query<Review[], number>({
      query: (productId) => {
        return {
          url: `${Pathes.publicPath}/productReviews/${productId}`,
          method: 'GET',
        };
      },
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.map((r) => ({ type: 'Review' as const, id: r.id })),
              'Review',
            ]
          : ['Review'],
    }),

    getMainPageProducts: builder.query<Product[], void>({
      query: () => {
        return {
          url: `${Pathes.publicPath}/mainPage`,
          method: 'GET',
        };
      },
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.map((p) => ({ type: 'Product' as const, id: p.id })),
              'Product',
            ]
          : ['Product'],
    }),

    getProduct: builder.query<Product, string>({
      query: (id) => {
        return {
          url: `${Pathes.publicPath}/${id}`,
          method: 'GET',
        };
      },
      providesTags: (result, error, arg) =>
        result ? [{ type: 'Product', id: result!.id }] : ['Product'],
    }),

    getDeveloper: builder.query<UniqueDeveloper, string>({
      query: (id) => {
        return {
          url: `${Pathes.publicPath}/developer/${id}`,
          method: 'GET',
        };
      },
    }),

    sendEstimates: builder.mutation<
      UserPrivateProductEstimates,
      { estimates: UserPrivateProductEstimates; token: string; service: string }
    >({
      query: ({ estimates, token, service }) => {
        return {
          url: `/RateThis-product/${service}/saveProfileEstimates`,
          method: 'POST',
          body: {
            ...estimates,
          },
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
        };
      },
      invalidatesTags: (result, error, arg) => [
        { type: 'Product', id: result?.productId },
        'PrivateEstimates',
      ],
    }),

    removeEstimates: builder.mutation<
      { profileId: number; productId: number },
      { user: UserProfile | undefined; productId: number; service: string }
    >({
      query: ({ user, productId, service }) => {
        return {
          url: `/RateThis-product/${service}/userEstimates/${productId}`,
          method: 'DELETE',
          headers: { Authorization: `Bearer ${user ? user.token : null}` },
          credentials: 'include',
        };
      },
      invalidatesTags: (result, error, arg) => [
        { type: 'Product', id: arg.productId },
        'PrivateEstimates',
      ],
    }),

    getExistingMarks: builder.query<
      UserPrivateProductEstimates,
      { user: UserProfile | undefined; productId: number; service: string }
    >({
      query: ({ user, productId, service }) => {
        return {
          url: `/RateThis-product/${service}/userEstimates/${productId}`,
          method: 'GET',
          headers: { Authorization: `Bearer ${user ? user.token : null}` },
          credentials: 'include',
        };
      },
      providesTags: (result, error, arg) => ['PrivateEstimates'],
    }),

    postUserReview: builder.mutation<
      SaveReview,
      { review: SaveReview; user: UserProfile }
    >({
      query: ({ review, user }) => {
        return {
          url: `/RateThis-review/thisUserReview`,
          method: 'POST',
          body: {
            ...review,
          },
          headers: { Authorization: `Bearer ${user ? user.token : null}` },
          credentials: 'include',
        };
      },
      invalidatesTags: (result, error, arg) => [
        'Review',
        { type: 'Product', id: result?.productId },
      ],
    }),

    getUserReactions: builder.query<Reaction[], UserProfile | undefined>({
      query: (user) => {
        return {
          url: `/RateThis-review/thisUserReactions`,
          method: 'GET',
          headers: { Authorization: `Bearer ${user ? user.token : null}` },
          credentials: 'include',
        };
      },
    }),

    postUserReaction: builder.mutation<
      void,
      {
        user: UserProfile | undefined;
        isLike: number;
        reviewId: number;
        productId: number;
      }
    >({
      query: ({ user, isLike, reviewId }) => {
        return {
          url: `/RateThis-review/addReaction/${reviewId}/${isLike}`,
          method: 'POST',
          headers: { Authorization: `Bearer ${user ? user.token : null}` },
          credentials: 'include',
        };
      },
    }),
    updateUserReview: builder.mutation<
      void,
      {
        message: string;
        productId: number;
        user: UserProfile;
        reviewId: number;
      }
    >({
      query: ({ message, user, productId }) => {
        return {
          url: `/RateThis-review/thisUserReview/${productId}`,
          method: 'POST',
          body: {
            message,
          },
          headers: { Authorization: `Bearer ${user ? user.token : null}` },
          credentials: 'include',
        };
      },
      invalidatesTags: (result, error, arg) => [
        { type: 'Review', id: arg.reviewId },
      ],
    }),
    deleteUserReview: builder.mutation<
      void,
      { productId: number; user: UserProfile }
    >({
      query: ({ user, productId }) => {
        return {
          url: `/RateThis-review/thisUserReview/${productId}`,
          method: 'DELETE',
          headers: { Authorization: `Bearer ${user ? user.token : null}` },
          credentials: 'include',
        };
      },
      invalidatesTags: (result, error, arg) => [
        'Review',
        { type: 'Product', id: arg.productId },
      ],
    }),
    getUserReports: builder.query<Report[], UserProfile | undefined>({
      query: (user) => {
        return {
          url: `/RateThis-review/getReports`,
          method: 'GET',
          headers: { Authorization: `Bearer ${user ? user.token : null}` },
          credentials: 'include',
        };
      },
      providesTags: (result, error, arg) => ['Report'],
    }),

    postUserReport: builder.mutation<
      void,
      { reportBody: string; reviewId: number; user: UserProfile }
    >({
      query: ({ reportBody, user, reviewId }) => {
        return {
          url: `/RateThis-review/addReport/${reviewId}`,
          method: 'POST',
          body: {
            reportBody,
          },
          headers: { Authorization: `Bearer ${user ? user.token : null}` },
          credentials: 'include',
        };
      },
      invalidatesTags: (result, error, arg) => ['Report'],
    }),

    deleteUserReviewByAdmin: builder.mutation<
      void,
      { reviewId: number; user: UserProfile }
    >({
      query: ({ user, reviewId }) => {
        return {
          url: `/RateThis-review/deleteReview/${reviewId}`,
          method: 'DELETE',
          headers: { Authorization: `Bearer ${user ? user.token : null}` },
          credentials: 'include',
        };
      },
      invalidatesTags: (result, error, arg) => ['Review', 'Product'],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetMainPageProductsQuery,
  useGetProductQuery,
  useGetDeveloperQuery,
  useSendEstimatesMutation,
  useGetExistingMarksQuery,
  useRemoveEstimatesMutation,
  usePostUserReviewMutation,

  useLazyGetUserReactionsQuery,

  usePostUserReactionMutation,
  useUpdateUserReviewMutation,
  useDeleteUserReviewMutation,
  useGetUserReportsQuery,
  usePostUserReportMutation,
  useLazyGetAllProductReviewsQuery,
  useLazyGetProductQuery,
  useDeleteProductMutation,
  useDeleteDeveloperMutation,
  useDeleteUserReviewByAdminMutation,
} = productApi;
export { productApi };
