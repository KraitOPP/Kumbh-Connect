import { apiSlice } from "./apiSlice";

const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder)=>({
        getProfile: builder.query({
            query: () => 'user',
            providesTags: ['User']
        }),
        updateProfile : builder.mutation({
            query: (data)=>({
                url: "/user/",
                method:"PUT",
                body: data,
            }),
            invalidatesTags: ['User']
        }),
    })
});

export const {useGetProfileQuery, useUpdateProfileMutation} = userApiSlice;