// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { basePath } from '../../config';
const baseQuery = fetchBaseQuery({
  baseUrl: `${basePath.url}/api/`,
  prepareHeaders: (headers, { getState }) => {
    const token = window.localStorage.getItem('accessToken');
    // If we have a token set in state, let's assume that we should be passing it.
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  }
});

// initialize an empty api service that we'll inject endpoints into later as needed
export const api = createApi({
  baseQuery: baseQuery,
  endpoints: () => ({})
});
