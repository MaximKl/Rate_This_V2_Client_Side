import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Pathes } from '../Pathes';
import { UserPublicProfileInfo } from '../../interfaces/user/UserPublicProfileInfo';
import { UserProfile } from '../../interfaces/user/UserProfile';
import { Friend } from '../../interfaces/user/Friend';
import { LightFriend } from '../../interfaces/user/LightFriend';
import { Book } from '../../interfaces/product/profileProduct/estimatesCategories/Book';
import { Game } from '../../interfaces/product/profileProduct/estimatesCategories/Game';
import { Film } from '../../interfaces/product/profileProduct/estimatesCategories/Film';
import { FullProduct } from '../../interfaces/product/profileProduct/FullProduct';

const userApi = createApi({
  reducerPath: 'user',
  baseQuery: fetchBaseQuery({
    baseUrl: Pathes.mainPath,
  }),
  tagTypes: ['User', 'Friends', 'FriendsSuggestions', 'FullFriends'],
  endpoints: (builder) => ({
    getUserPageInfo: builder.query<UserPublicProfileInfo, string>({
      query: (nick) => {
        return {
          url: `${Pathes.publicPath}/user/${nick}`,
          method: 'GET',
        };
      },
      providesTags: (result, error, arg) => ['User'],
    }),
    getUserFriends: builder.query<Friend[], string>({
      query: (nick) => {
        return {
          url: `${Pathes.publicPath}/userFriends/${nick}`,
          method: 'GET',
        };
      },
      providesTags: (result, error, arg) => ['FullFriends'],
    }),
    getUserSuggestions: builder.query<Friend[], string>({
      query: (nick) => {
        return {
          url: `${Pathes.publicPath}/userFriendSuggestion/${nick}`,
          method: 'GET',
        };
      },
      providesTags: (result, error, arg) => ['FriendsSuggestions'],
    }),
    getLightFriends: builder.query<LightFriend[], string>({
      query: (nick) => {
        return {
          url: `${Pathes.publicPath}/userLightFriends/${nick}`,
          method: 'GET',
        };
      },
      providesTags: (result, error, arg) => ['Friends'],
    }),
    postUserSuggestion: builder.mutation<
      void,
      { friendId: number; user: UserProfile; type: string }
    >({
      query: ({ friendId, user }) => {
        return {
          url: `RateThis/addFriend/${friendId}`,
          method: 'POST',
          headers: { Authorization: `Bearer ${user ? user.token : null}` },
          credentials: 'include',
        };
      },
      invalidatesTags: (result, error, arg) => {
        if (arg.type === 'add') {
          return ['User', 'FullFriends', 'Friends'];
        }
        if (arg.type === 'approve') {
          return ['User', 'FullFriends', 'FriendsSuggestions', 'Friends'];
        }
        return [];
      },
    }),
    deleteFriend: builder.mutation<
      void,
      { friendId: number; user: UserProfile; type: string }
    >({
      query: ({ friendId, user }) => {
        return {
          url: `RateThis/removeFriend/${friendId}`,
          method: 'DELETE',
          headers: { Authorization: `Bearer ${user ? user.token : null}` },
          credentials: 'include',
        };
      },
      invalidatesTags: (result, error, arg) => {
        if (arg.type === 'delete') {
          return ['User', 'FullFriends', 'Friends'];
        }
        if (arg.type === 'deny') {
          return ['User', 'FullFriends', 'FriendsSuggestions', 'Friends'];
        }
        return [];
      },
    }),
    getUserProducts: builder.query<
      Book[] | Game[] | Film[],
      { nick: string; productType: string }
    >({
      query: ({ nick, productType }) => {
        return {
          url: `${Pathes.publicPath}/user/${nick}/${productType}`,
          method: 'GET',
        };
      },
    }),
    getFullUserProduct: builder.query<
      FullProduct,
      { nick: string; productType: string; productId: string }
    >({
      query: ({ nick, productType, productId }) => {
        return {
          url: `${Pathes.publicPath}/user/${nick}/${productType}/${productId}`,
          method: 'GET',
        };
      },
    }),

    deleteReview: builder.mutation<
      void,
      { username: string; productId: number; token: string }
    >({
      query: ({ username, token, productId }) => {
        return {
          url: `RateThis-product/removeReview/${username}/${productId}`,
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
        };
      },
    }),
  }),
});

export const {
  useGetUserPageInfoQuery,
  usePostUserSuggestionMutation,
  useDeleteFriendMutation,
  useLazyGetUserFriendsQuery,
  useLazyGetUserSuggestionsQuery,
  useGetLightFriendsQuery,
  useGetUserFriendsQuery,
  useLazyGetUserProductsQuery,
  useGetFullUserProductQuery,
  useDeleteReviewMutation,
} = userApi;
export { userApi };
