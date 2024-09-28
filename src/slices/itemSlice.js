import { apiSlice } from "./apiSlice";

const itemsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder)=>({
            reportItem: builder.mutation({
                query:(data)=>({
                    url:'/item/',
                    method:'POST',
                    body:data,
                })
            }),
            getItem: builder.mutation({
                query:()=>({
                    url:'/item/',
                    method:'GET',
                })
            }),
        }
    )
})

export const {useReportItemMutation, useGetItemMutation} = itemsApiSlice;