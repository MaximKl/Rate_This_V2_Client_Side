import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Pathes } from '../Pathes';
import { IdAndName } from '../../interfaces/product/addProduct/IdAndName';
import { Developer } from '../../interfaces/product/addProduct/Developer';
import { ProductForSave } from '../../interfaces/product/addProduct/ProductForSave';
import { DeveloperToAdd } from '../../interfaces/product/addProduct/DeveloperToAdd';
import { DeveloperForUpdate } from '../../interfaces/product/addProduct/DeveloperForUpdate';

const addProductApi = createApi({
  reducerPath: 'addProduct',
  baseQuery: fetchBaseQuery({
    baseUrl: Pathes.mainPath,
  }),
  tagTypes: ['Genre', 'Developer', 'GameType', 'DeveloperRole'],
  endpoints: (builder) => ({
    getAllGenres: builder.query<IdAndName[], string>({
      query: (token) => {
        return {
          url: `RateThis-product/genres`,
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
        };
      },
      providesTags: (result, error, arg) =>
        result
          ? [...result.map((r) => ({ type: 'Genre' as const, id: r.id }))]
          : ['Genre'],
    }),
    getAllCountries: builder.query<IdAndName[], string>({
      query: (token) => {
        return {
          url: `RateThis-product/countries`,
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
        };
      },
    }),
    getAllGameTypes: builder.query<IdAndName[], string>({
      query: (token) => {
        return {
          url: `RateThis-product/game-types`,
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
        };
      },
      providesTags: (result, error, arg) =>
        result
          ? [...result.map((r) => ({ type: 'GameType' as const, id: r.id }))]
          : ['GameType'],
    }),
    getAllRoles: builder.query<IdAndName[], string>({
      query: (token) => {
        return {
          url: `RateThis-product/developers-roles`,
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
        };
      },
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.map((r) => ({
                type: 'DeveloperRole' as const,
                id: r.id,
              })),
            ]
          : ['DeveloperRole'],
    }),
    getAllDevelopers: builder.query<Map<string, Developer[]>, string>({
      query: (token) => {
        return {
          url: `RateThis-product/developers`,
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
        };
      },
      providesTags: (result, error, arg) => {
        var devMap: string[] = [];
        result &&
          Object.entries(result).forEach(
            ([role, [...devs]]: [role: string, devs: Developer[]]) => {
              devMap.push(role);
            }
          );
        return devMap.length > 0
          ? [...devMap.map((d) => ({ type: 'Developer' as const, id: d }))]
          : ['Developer'];
      },
    }),
    getDeveloper: builder.query<
      DeveloperForUpdate,
      { devId: number; token: string }
    >({
      query: ({ devId, token }) => {
        return {
          url: `RateThis-product/developers/${devId}`,
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
        };
      },
    }),

    saveProduct: builder.mutation<
      void,
      { product: ProductForSave; token: string }
    >({
      query: ({ product, token }) => {
        return {
          url: `RateThis-product/save-product`,
          method: 'POST',
          body: { ...product },
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
        };
      },
    }),
    saveGenre: builder.mutation<void, { object: IdAndName; token: string }>({
      query: ({ object, token }) => {
        return {
          url: `RateThis-product/genres`,
          method: 'POST',
          body: { ...object },
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
        };
      },
      invalidatesTags: (result, error, arg) =>
        arg.object.id > 0 ? [{ type: 'Genre', id: arg.object.id }] : ['Genre'],
    }),

    saveGameType: builder.mutation<void, { object: IdAndName; token: string }>({
      query: ({ object, token }) => {
        return {
          url: `RateThis-product/game-types`,
          method: 'POST',
          body: { ...object },
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
        };
      },
      invalidatesTags: (result, error, arg) =>
        arg.object.id > 0
          ? [{ type: 'GameType', id: arg.object.id }]
          : ['GameType'],
    }),

    saveDeveloper: builder.mutation<
      void,
      { developer: DeveloperToAdd; token: string }
    >({
      query: ({ developer, token }) => {
        return {
          url: `RateThis-product/developers`,
          method: 'POST',
          body: { ...developer },
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
        };
      },
      invalidatesTags: (result, error, arg) => ['Developer'],
    }),

    saveDeveloperRole: builder.mutation<
      void,
      { object: IdAndName; token: string }
    >({
      query: ({ object, token }) => {
        return {
          url: `RateThis-product/developers-roles`,
          method: 'POST',
          body: { ...object },
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
        };
      },
      invalidatesTags: (result, error, arg) =>
        arg.object.id > 0
          ? [{ type: 'DeveloperRole', id: arg.object.id }]
          : ['DeveloperRole'],
    }),
  }),
});

export const {
  useGetAllGenresQuery,
  useGetAllCountriesQuery,
  useGetAllGameTypesQuery,
  useGetAllDevelopersQuery,
  useSaveProductMutation,
  useSaveGameTypeMutation,
  useSaveGenreMutation,
  useSaveDeveloperMutation,
  useGetAllRolesQuery,
  useSaveDeveloperRoleMutation,
  useLazyGetDeveloperQuery,
} = addProductApi;

export { addProductApi };
