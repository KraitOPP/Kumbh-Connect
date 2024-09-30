import ItemCard from "@/components/ItemCard";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useGetItemMutation } from "@/slices/itemSlice";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


export default function HomePage() {
  const [getItem, { isLoading: isFetching }] = useGetItemMutation();
  const [items, setItems] = useState([]);

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

    fetchItems();
  }, []);

  return (
    <div className="m-5  flex justify-center items-center flex-col gap-5">
      <Card className="sm:col-span-2 w-full" x-chunk="dashboard-05-chunk-0">
        <CardHeader className="pb-3">
          <CardTitle>Report Lost/Found Item</CardTitle>
          <CardDescription className="max-w-lg text-balance leading-relaxed">
            Report any lost or found item.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link to={"/report/item"}>
            <Button>Report</Button>
          </Link>
        </CardFooter>
      </Card>
      <h2 className="text-2xl font-bold w-full text-start">Recent Lost and Found Items</h2>
      {isFetching ? (
        <Loader2 className="animate-spin" />
      ) : (
        <div className="items-center grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {items.length > 0 ? <>
            {items.map((item) => (
              <ItemCard item={item} />
            ))}
          </> : <>
            <p>No Items Found</p>
          </>}
        </div>
      )}
    </div>
  )
}