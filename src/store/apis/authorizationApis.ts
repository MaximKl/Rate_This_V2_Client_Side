import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Pathes } from '../Pathes';
import { UserRegistrationProfile } from '../../interfaces/user/UserRegistrationProfile';
import { UserAuthorizationProfile } from '../../interfaces/user/UserAuthorizationProfile';
import { UserProfile } from '../../interfaces/user/UserProfile';

const authorizationApi = createApi({
  reducerPath: 'authorization',
  baseQuery: fetchBaseQuery({
    baseUrl: Pathes.mainPath,
  }),
  endpoints: (builder) => ({
    registration: builder.mutation<string, UserRegistrationProfile>({
      query: (user) => {
        return {
          url: `/registration`,
          method: 'POST',
          body: {
            ...user,
          },
        };
      },
    }),
    authorization: builder.mutation<UserProfile, UserAuthorizationProfile>({
      query: (user) => {
        return {
          url: `/authorization`,
          method: 'POST',
          body: {
            ...user,
          },
          credentials: 'include',
        };
      },
    }),
    validate: builder.query<UserProfile, void>({
      query: () => {
        return {
          url: `/validate`,
          method: 'GET',
          credentials: 'include',
        };
      },
    }),
    exit: builder.query<void, UserProfile>({
      query: (user) => {
        return {
          url: `/exit`,
          method: 'GET',
          headers: { Authorization: `Bearer ${user.token}` },
          credentials: 'include',
        };
      },
    }),
    settings: builder.mutation<
      UserProfile,
      { user: UserRegistrationProfile; token: string }
    >({
      query: ({ user, token }) => {
        return {
          url: `/RateThis/settings`,
          method: 'POST',
          body: { ...user },
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
        };
      },
    }),
    getSettingsInfo: builder.query<UserRegistrationProfile, string>({
      query: (token) => {
        return {
          url: `/RateThis/settings`,
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
        };
      },
    }),
    isAdmin: builder.query<void, string>({
      query: (token) => {
        return {
          url: `/RateThis/isAdmin`,
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
        };
      },
    }),

    deleteProfile: builder.mutation<void, { profileId: number; token: string }>(
      {
        query: ({ profileId, token }) => {
          return {
            url: `/RateThis/deleteProfile/${profileId}`,
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
            credentials: 'include',
          };
        },
      }
    ),
    deleteProfileByAdmin: builder.mutation<
      void,
      { profileId: number; token: string }
    >({
      query: ({ profileId, token }) => {
        return {
          url: `/RateThis/deleteProfileByAdmin/${profileId}`,
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
        };
      },
    }),
  }),
});

export const {
  useRegistrationMutation,
  useAuthorizationMutation,
  useValidateQuery,
  useLazyValidateQuery,
  useLazyExitQuery,
  useSettingsMutation,
  useGetSettingsInfoQuery,
  useLazyIsAdminQuery,
  useDeleteProfileMutation,
  useDeleteProfileByAdminMutation,
} = authorizationApi;
export { authorizationApi };
