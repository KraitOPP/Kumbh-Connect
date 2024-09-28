import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListFilter, Loader2, MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { useGetItemMutation } from "@/slices/itemSlice";
import { differenceInDays } from "date-fns";

export default function AdminDashboardPage() {
  const [getItem, { isLoading }] = useGetItemMutation();
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({
    found: true,
    lost: true,
    returned: true,
  });
  const [timeFilter, setTimeFilter] = useState("week");

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

  const handleFilterChange = (filter) => {
    setFilters((prevFilter) => ({
      ...prevFilter,
      [filter]: !prevFilter[filter],
    }));
  };

  const filterItems = (items, timeFilter, statusFilters) => {
    const now = new Date();

    return items.filter((item) => {
      const dateReported = new Date(item.dateReported);

      const isWithinTime =
        (timeFilter === "week" && differenceInDays(now, dateReported) <= 7) ||
        (timeFilter === "month" && differenceInDays(now, dateReported) <= 30) ||
        (timeFilter === "year" && differenceInDays(now, dateReported) <= 365);
      const matchesStatus =
        (statusFilters.lost && item.status === "lost") ||
        (statusFilters.found && item.status === "found") ||
        (statusFilters.returned && item.status === "returned");
      return isWithinTime && matchesStatus;
    });
  };

  const filteredItems = filterItems(items, timeFilter, filters);

  return (
    <div className="m-5 flex flex-col gap-4">
      <div className="flex mt-3 font-bold ml-4">Admin Dashboard</div>
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
      <div className="mt-3 mb-3">
        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-3">
              <Tabs
                defaultValue="week"
                onValueChange={(value) => setTimeFilter(value)}
              >
                <div className="flex items-center">
                  <TabsList>
                    <TabsTrigger value="week">Week</TabsTrigger>
                    <TabsTrigger value="month">Month</TabsTrigger>
                    <TabsTrigger value="year">Year</TabsTrigger>
                  </TabsList>
                  <div className="ml-auto flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 gap-1 text-sm"
                        >
                          <ListFilter className="h-3.5 w-3.5" />
                          <span className="sr-only sm:not-sr-only">Filter</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem
                          onCheckedChange={() => handleFilterChange("lost")}
                          checked={filters.lost}
                        >
                          Lost
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          onCheckedChange={() => handleFilterChange("found")}
                          checked={filters.found}
                        >
                          Found
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          onCheckedChange={() =>
                            handleFilterChange("returned")
                          }
                          checked={filters.returned}
                        >
                          Returned
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <TabsContent value={timeFilter}>
                  <Card x-chunk="dashboard-05-chunk-3">
                    <CardHeader className="px-7">
                      <CardTitle>Items</CardTitle>
                      <CardDescription>
                        Recent Lost/Found Items.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="hidden w-[100px] sm:table-cell">
                              <span className="">Image</span>
                            </TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="hidden md:table-cell">
                              ReportedBy
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                              Category
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                              Date Reported
                            </TableHead>
                            <TableHead>
                              <span className="sr-only">Actions</span>
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredItems.length > 0 &&
                            filteredItems.map((item) => (
                              <TableRow key={item._id}>
                                <TableCell className="hidden sm:table-cell">
                                  <img
                                    className="aspect-square rounded-md object-cover"
                                    height="64"
                                    src={item?.images[0]?.url}
                                    width="64"
                                  />
                                </TableCell>
                                <TableCell className="font-medium">
                                  {item.name}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">{item.status}</Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  <div className="font-medium">
                                    {item.reportedBy.firstName}
                                  </div>
                                  <div className="hidden text-sm text-muted-foreground md:inline">
                                    {item.reportedBy.email}
                                  </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  {item.category.name}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  {new Date(item.dateReported).toDateString()}
                                </TableCell>
                                <TableCell>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        aria-haspopup="true"
                                        size="icon"
                                        variant="ghost"
                                      >
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">
                                          Toggle menu
                                        </span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                      <DropdownMenuItem>Edit</DropdownMenuItem>
                                      <DropdownMenuItem>Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            <div></div>
          </main>
        )}
      </div>
    </div>
  );
}
