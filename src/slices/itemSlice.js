import { apiSlice } from "./apiSlice";

const itemsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        reportItem: builder.mutation({
            query: (data) => ({
                url: '/item/',
                method: 'POST',
                body: data,
            })
        }),
        updateItem: builder.mutation({
            query: ({ _id, item }) => ({
                url: `item/${_id}`,
                method: 'PUT',
                body: item
            }),
            invalidatesTags: ['Items']
        }),
        getItems: builder.query({
            query: () => 'item',
            providesTags: ['Items']
        }),
        getItemsByCategory: builder.query({
            query: (categoryId) => `item/category/${categoryId}`,
            providesTags: ['Items']
        }),
        getUserItem: builder.query({
            query: (categoryId) => 'item/user',
            providesTags: ['Items']
        }),
        getItemById: builder.query({
            query: (id) => `/item/id/${id}`,
            providesTags: ['Items']
        }),
    }
    )
})

export const { useReportItemMutation, useUpdateItemMutation, useGetItemsQuery,useGetItemsByCategoryQuery, useGetUserItemQuery, useGetItemByIdQuery } = itemsApiSlice;