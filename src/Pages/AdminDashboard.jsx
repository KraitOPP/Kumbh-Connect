import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { useGetItemMutation } from "@/slices/itemSlice";
import Items from "@/components/Items";

export default function AdminDashboardPage() {
  const [getItem, { isLoading }] = useGetItemMutation();
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
  }, [getItem]);

  return (
    <div className="m-5 flex flex-col gap-4">
      <div className="flex mt-3 font-bold ml-4">Admin Dashboard</div>

      
      <div className="mt-3 mb-3 flex items-center justify-center">
        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
            <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
              <CardHeader className="pb-3">
                <CardTitle>Add New Category</CardTitle>
                <CardDescription className="max-w-lg text-balance leading-relaxed">
                  Add new lost/found item category here.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Link to={"/dashboard/category/add-new"}>
                  <Button>Add New</Button>
                </Link>
              </CardFooter>
            </Card>
            <Items items={items}/>
          </main>
        )}
      </div>
    </div>
  );
}
