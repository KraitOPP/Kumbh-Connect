import { apiSlice } from "./apiSlice";

const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder)=>({
        getProfile : builder.mutation({
            query: ()=>({
                url: "/user/",
                method:"GET",
            })
        }),
        updateProfile : builder.mutation({
            query: (data)=>({
                url: "/user/",
                method:"PUT",
                body: data,
            })
        }),
    })
});

export const {useGetProfileMutation, useUpdateProfileMutation} = userApiSlice;