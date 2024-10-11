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
            getItemByCategory: builder.mutation({
                query:(categoryId)=>({
                    url:`/item/category/${categoryId}`,
                    method:'GET',
                })
            }),
            getUserItem: builder.mutation({
                query:()=>({
                    url:'/item/user/',
                    method:'GET',
                })
            }),
            getItemById: builder.mutation({
                query:(id)=>({
                    url:`/item/id/${id}`,
                    method:'GET',
                })
            }),
        }
    )
})

export const {useReportItemMutation, useGetItemMutation, useGetItemByCategoryMutation, useGetUserItemMutation, useGetItemByIdMutation} = itemsApiSlice;