import CategoryCard from "@/components/categoryCard";
import ItemCard from "@/components/ItemCard";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useGetItemCategoryMutation } from "@/slices/categorySlice";
import { useGetItemMutation } from "@/slices/itemSlice";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


export default function HomePage() {
  const [getItem, { isLoading: isFetching }] = useGetItemMutation();
  const [getCategories, { isLoading: isFetchingCategory }] = useGetItemCategoryMutation
  ();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await getItem().unwrap();
        if (res.success) {
          setItems(res.items);
        } else {
          toast({
            title: "Failed to Load Items",
            description: res.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Failed to Load Items",
          description: error?.data?.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    };
    const fetchCategories = async () => {
      try {
        const res = await getCategories().unwrap();
        if (res.success) {
          setCategories(res.categories);
        } else {
          toast({
            title: "Failed to Load Categories",
            description: res.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Failed to Load Categories",
          description: error?.data?.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    };

    fetchItems();
    fetchCategories();
  }, []);

  return (
    <div className="m-5  flex justify-center items-center flex-col gap-5">
      <Card className="sm:col-span-2 w-full" x-chunk="dashboard-05-chunk-0">
        <CardHeader className="pb-3">
          <CardTitle>Report Lost/Found Item</CardTitle>
          <CardDescription className="max-w-lg text-balance leading-relaxed">
            Lost Something, Report Here.
            Found Something Help by Reporting here.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link to={"/report/item"}>
            <Button>Report</Button>
          </Link>
        </CardFooter>
      </Card>
      <div className="w-full p-1">
        <h2 className="text-2xl mb-3">Browse By <b>Category</b></h2>
          {isFetchingCategory ? (
            <Loader2 className="animate-spin" />
          ): (
            <div className="flex gap-1">
              {categories.length>0 && categories.map((category) => (
                <Link to={`/category/${category._id}`} key={category._id}><CategoryCard category={category} /></Link>
              ))}
            </div>
          )}
      </div>
      <h2 className="text-2xl font-bold w-full text-start">Recent Listings</h2>
        {isFetching ? (
          <Loader2 className="animate-spin" />
        ) : (
          <div className="items-center grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {items.length > 0 ? <>
              {items.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </> : <>
              <p>No Items Found</p>
            </>}
          </div>
        )}
    </div>
  )
}