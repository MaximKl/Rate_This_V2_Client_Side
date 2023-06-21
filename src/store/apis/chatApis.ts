import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Pathes } from '../Pathes';
import { UserProfile } from '../../interfaces/user/UserProfile';

const chatApi = createApi({
  reducerPath: 'chat',
  baseQuery: fetchBaseQuery({
    baseUrl: Pathes.mainPath,
  }),
  tagTypes: [],
  endpoints: (builder) => ({
    getAllChatMessages: builder.query<
      ChatMessage[],
      { user: UserProfile; friendId: number }
    >({
      query: ({ user, friendId }) => {
        return {
          url: `RateThis-chat/allMessages/${friendId}`,
          method: 'GET',
          headers: { Authorization: `Bearer ${user ? user.token : null}` },
          credentials: 'include',
        };
      },
    }),
    getAllLastMessages: builder.query<ChatMessage[], UserProfile>({
      query: (user) => {
        return {
          url: `RateThis-chat/recentMessages`,
          method: 'GET',
          headers: { Authorization: `Bearer ${user ? user.token : null}` },
          credentials: 'include',
        };
      },
    }),
  }),
});

export const {
  useLazyGetAllChatMessagesQuery,
  useLazyGetAllLastMessagesQuery,
} = chatApi;

export { chatApi };
