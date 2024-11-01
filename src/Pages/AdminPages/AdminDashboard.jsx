import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Loader2, 
  PlusCircle, 
  LayoutDashboard, 
  Package, 
  Tags,
  Users,
  AlertCircle,
  ArrowUpRight
} from "lucide-react";
import {  useDeleteItemMutation, useGetItemsQuery } from "@/slices/itemSlice";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Items from "@/components/Items";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";

const StatsCard = ({ title, value, icon: Icon, trend }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">
        {title}
      </CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {trend && (
        <p className="text-xs text-muted-foreground">
          {trend > 0 ? '+' : ''}{trend}% from last month
        </p>
      )}
    </CardContent>
  </Card>
);

const QuickAction = ({ title, description, icon: Icon, to }) => (
  <Link to={to}>
    <Card className="hover:bg-accent/50 transition-colors">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Icon className="h-5 w-5 text-primary" />
          <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  </Link>
);

const AdminDashboardPage = () => {
  const [deleteItem] = useDeleteItemMutation();
  const { data, isLoading, error, refetch } = useGetItemsQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");


  const handleDeleteItem = async (itemId) => {
    try {
        const res = await deleteItem(itemId).unwrap();
        if (res.success) {
            toast({
                title: "Item Deleted Succesfully",
            });
        } else {
            toast({
                title: "Failed to Delete Item",
                description: res.message,
                variant: "destructive",
            });
        }
    } catch (error) {
        toast({
            title: "Failed to Delete Item",
            description: error?.data?.message || "An unexpected error occurred.",
            variant: "destructive",
        });
    }
}

  useEffect(() => {
    if (error) {
      toast({
        title: "Failed to Load Items",
        description: error?.data?.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const items = data?.items || [];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalItems: items.length,
    lostItems: items.filter(item => item.status === "lost").length,
    foundItems: items.filter(item => item.status === "found").length,
    returnedItems: items.filter(item => item.returnedToOwner).length,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and monitor your lost and found items
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard 
            title="Total Items" 
            value={stats.totalItems} 
            icon={Package}
            trend={12}
          />
          <StatsCard 
            title="Lost Items" 
            value={stats.lostItems} 
            icon={AlertCircle}
            trend={-8}
          />
          <StatsCard 
            title="Found Items" 
            value={stats.foundItems} 
            icon={Package}
            trend={24}
          />
          <StatsCard 
            title="Returned Items" 
            value={stats.returnedItems} 
            icon={Users}
            trend={18}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <QuickAction
            title="Add Category"
            description="Create new item categories"
            icon={Tags}
            to="/dashboard/category/add-new"
          />
          <QuickAction
            title="Manage Users"
            description="View and manage user accounts"
            icon={Users}
            to="/dashboard/users"
          />
          <QuickAction
            title="System Settings"
            description="Configure system preferences"
            icon={LayoutDashboard}
            to="/dashboard/settings"
          />
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Items Management</CardTitle>
            <CardDescription>
              View and manage all lost and found items
            </CardDescription>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="flex-1">
                <Input
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <div className="flex gap-4">
                <Select
                  value={filterStatus}
                  onValueChange={setFilterStatus}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Items</SelectItem>
                    <SelectItem value="lost">Lost Items</SelectItem>
                    <SelectItem value="found">Found Items</SelectItem>
                  </SelectContent>
                </Select>
                <Link to="/report/item">
                  <Button className="gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Add Item
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <Items items={filteredItems} onDeleteItem={handleDeleteItem} refetch={refetch} />
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredItems.length} of {items.length} items
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;