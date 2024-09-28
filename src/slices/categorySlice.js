import { apiSlice } from "./apiSlice";

const categoryApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder)=>({
        addItemCategory: builder.mutation({
            query:(data)=>({
                url:'/category/',
                method:'POST',
                body:data,
            })
        }),

        getItemCategory: builder.mutation({
            query:()=>({
               url:'/category/',
                method:'GET',
            })
        }),        
    }
)})

export const {useAddItemCategoryMutation, useGetItemCategoryMutation} = categoryApiSlice;