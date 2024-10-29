import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {  AlertCircle, Plus, Archive } from "lucide-react";
import { motion } from "framer-motion";
import { useGetItemsQuery } from "@/slices/itemSlice";
import { useGetItemCategoryQuery } from "@/slices/categorySlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import CategoryCard from "@/components/categoryCard";
import ItemCard from "@/components/ItemCard";

const ItemSkeleton = () => (
  <div className="space-y-3">
    <div className="h-40 bg-gray-200 rounded-lg animate-pulse" />
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
    </div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <Card className="border-red-200 bg-red-50">
    <CardContent className="p-4 flex items-center gap-2 text-red-600">
      <AlertCircle className="h-5 w-5" />
      <p>{message}</p>
    </CardContent>
  </Card>
);

const HeroSection = () => (
  <Card className="w-full bg-gradient-to-r from-gray-800 to-gray-400 text-white">
    <CardHeader className="pb-3">
      <CardTitle className="text-3xl font-bold">Mahakumbh Lost & Found Portal</CardTitle>
      <CardDescription className="text-gray-100 text-lg">
        Lost something? Found something? We're here to help reconnect items with their owners.
      </CardDescription>
    </CardHeader>
    <CardFooter className="flex gap-4">
      <Link to="/report/item">
        <Button variant="secondary" className="gap-2">
          <Plus className="h-4 w-4" />
          Report Item
        </Button>
      </Link>
    </CardFooter>
  </Card>
);

export default function HomePage() {
  const { data, isLoading: isFetching, errorInFetchingItems, refetchItem } = useGetItemsQuery();
  const items = data?.items || [];
  const { data: Catdata, isLoading: isFetchingCategory, errorInFetchingCategories, refetchCategories } = useGetItemCategoryQuery();
  const categories = Catdata?.categories || [];
  const [error, setError] = useState(null);

  useEffect(() => {
    if (errorInFetchingItems) {
        toast({
            title: "Failed to Load Content",
            description: errorInFetchingItems?.data?.message || "An unexpected error occurred.",
            variant: "destructive",
        });
        setError(errorInFetchingItems?.data?.message || "An unexpected error occurred.");
    }
    if (errorInFetchingCategories) {
        toast({
            title: "Failed to Load Content",
            description: errorInFetchingCategories?.data?.message || "An unexpected error occurred.",
            variant: "destructive",
        });
        setError(errorInFetchingCategories?.data?.message || "An unexpected error occurred.");
    }
}, [errorInFetchingItems,errorInFetchingCategories, toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <HeroSection />

        {error && <ErrorMessage message={error} />}

        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Categories</h2>
          </div>
          
          {isFetchingCategory ? (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-48 h-24 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link to={`/category/${category._id}`}>
                    <CategoryCard category={category} />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4 ">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold">Recent Listings</h2>
          </div>

          {isFetching ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <ItemSkeleton key={i} />
              ))}
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-center"
                >
                  <ItemCard item={item} />
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <CardContent className="space-y-2">
                <div className="flex justify-center">
                  <Archive className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold">No Items Found</h3>
                <p className="text-gray-500">
                   No items have been posted yet
                </p>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
};
