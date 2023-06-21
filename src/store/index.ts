import { configureStore } from '@reduxjs/toolkit';
import { productApi } from './apis/productApis';
import { authorizationApi } from './apis/authorizationApis';
import { userApi } from './apis/userApis';
import { chatApi } from './apis/chatApis';
import { addProductApi } from './apis/addProductApis';

export const store = configureStore({
  reducer: {
    [productApi.reducerPath]: productApi.reducer,
    [authorizationApi.reducerPath]: authorizationApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [addProductApi.reducerPath]: addProductApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(productApi.middleware)
      .concat(authorizationApi.middleware)
      .concat(userApi.middleware)
      .concat(chatApi.middleware)
      .concat(addProductApi.middleware);
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
