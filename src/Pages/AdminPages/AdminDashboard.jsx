import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  Tags,
  Users,
  AlertCircle,
  ArrowUpRight
} from "lucide-react";
import {  useGetItemsQuery } from "@/slices/itemSlice";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ItemsListingPage from "./Items/itemsListing";

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
  const { data, isLoading, error, refetch } = useGetItemsQuery();

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
            title="Manage Claims"
            description="View and Manage claims by users"
            icon={LayoutDashboard}
            to="/dashboard/claims"
          />
        </div>
        <ItemsListingPage />
      </div>
    </div>
  );
};

export default AdminDashboardPage;