import { api } from './api';

// Define a service using a base URL and expected endpoints
export const automationApi = api.injectEndpoints({
  reducerPath: 'automationApi',
  endpoints: (builder) => ({
    getDiscoveryStatus: builder.query({
      query: (id) => `automation/discovery/${id}`
    }),
    getRunStatus: builder.query({
      query: (run_id) => `tasks/run/${run_id}`
    })
  }),
  overrideExisting: false
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetDiscoveryStatusQuery,  useGetRunStatusQuery } = automationApi;
