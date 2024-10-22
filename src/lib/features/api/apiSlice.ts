import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://blog-app-bay-one.vercel.app/api'
    : 'http://localhost:3000/api';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: () => ({}),
});
