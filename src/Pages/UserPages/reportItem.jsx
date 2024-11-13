import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { 
    Loader2, 
    ImagePlus,
    Trash2,
    MapPin,
    ArrowRight,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useReportItemMutation } from "@/slices/itemSlice";
import { useGetItemCategoryQuery } from "@/slices/categorySlice";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import "leaflet/dist/leaflet.css";

const itemSchema = z.object({
    name: z.string().nonempty("Item name is required"),
    description: z.string().nonempty("Description is required"),
    status: z.enum(['lost', 'found'], { message: "Status is required" }),
    category: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Please select a category" }),
    images: z.array(z.object({ url: z.string().url("Please enter a valid image URL") })),
    location: z.object({
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
    }),
});

const LocationMarker = ({ location, setLocation }) => {
    useMapEvents({
        click(e) {
            setLocation({ latitude: e.latlng.lat, longitude: e.latlng.lng });
        },
    });

    return location.latitude && location.longitude ? (
        <Marker position={[location.latitude, location.longitude]} />
    ) : null;
};

export default function ReportItemPage() {
    const navigate = useNavigate();
    const [reportItem, { isReporting }] = useReportItemMutation();
    const { data, isLoading: isFetchingCategory } = useGetItemCategoryQuery();
    const categories = data?.categories || [];
    const [images, setImages] = useState([""]);
    const [location, setLocation] = useState({
        latitude: 25.427980726672878,
        longitude: 81.77186608292688
    });

    const form = useForm({
        resolver: zodResolver(itemSchema),
        defaultValues: {
            name: "",
            description: "",
            category: "",
            status: "",
            images: [],
            location: {
                latitude: 25.427980726672878,
                longitude: 81.77186608292688
            },
        },
    });

    async function onSubmit(data) {
        try {
            data.images = images.map((url) => ({ url: url.trim() })).filter(img => img.url);
            data.location = location;
            const res = await reportItem(data).unwrap();
            if (res.success) {
                toast({ title: "Success!", description: "Item reported successfully" });
                navigate("/", { replace: true });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error?.data?.message || "An unexpected error occurred.",
                variant: "destructive",
            });
        }
    }

    if (isFetchingCategory) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Report an Item</h1>
                    <p className="text-gray-500">Submit details about a lost or found item</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <Card className="shadow-lg">
                            <CardContent className="p-6">
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <h2 className="text-xl font-semibold flex items-center gap-2">
                                            <div className="h-8 w-1 bg-blue-500 rounded-full" />
                                            Basic Information
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Item Name</FormLabel>
                                                        <FormControl>
                                                            <Input 
                                                                placeholder="e.g., Black Leather Wallet" 
                                                                className="bg-white"
                                                                {...field} 
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            
                                            <FormField
                                                control={form.control}
                                                name="status"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Status</FormLabel>
                                                        <Select onValueChange={field.onChange}>
                                                            <FormControl>
                                                                <SelectTrigger className="bg-white">
                                                                    <SelectValue placeholder="Select status" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="lost">Lost</SelectItem>
                                                                <SelectItem value="found">Found</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="category"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Category</FormLabel>
                                                    <Select onValueChange={field.onChange}>
                                                        <FormControl>
                                                            <SelectTrigger className="bg-white">
                                                                <SelectValue placeholder="Select category" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {categories.map((category) => (
                                                                <SelectItem key={category._id} value={category._id}>
                                                                    {category.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Description</FormLabel>
                                                    <FormControl>
                                                        <Textarea 
                                                            placeholder="Provide detailed description including color, brand, distinguishing features..."
                                                            className="min-h-[120px] bg-white"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <h2 className="text-xl font-semibold flex items-center gap-2">
                                            <div className="h-8 w-1 bg-blue-500 rounded-full" />
                                            Location
                                        </h2>
                                        <div className="bg-white rounded-lg overflow-hidden border">
                                            <div className="h-[300px]">
                                                <MapContainer
                                                    center={[location.latitude, location.longitude]}
                                                    zoom={13}
                                                    style={{ height: "100%", width: "100%" }}
                                                    className="z-0"
                                                >
                                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                                    <LocationMarker location={location} setLocation={setLocation} />
                                                </MapContainer>
                                            </div>
                                            <div className="p-3 bg-gray-50 border-t flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-gray-500" />
                                                <span className="text-sm text-gray-600">Click on the map to set location</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h2 className="text-xl font-semibold flex items-center gap-2">
                                            <div className="h-8 w-1 bg-blue-500 rounded-full" />
                                            Images
                                        </h2>
                                        <div className="space-y-3">
                                            {images.map((url, index) => (
                                                <div key={index} className="flex gap-2">
                                                    <Input
                                                        type="text"
                                                        placeholder="Enter image URL"
                                                        className="bg-white"
                                                        value={url}
                                                        onChange={(e) =>
                                                            setImages(images.map((u, i) =>
                                                                i === index ? e.target.value : u
                                                            ))
                                                        }
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => setImages(images.filter((_, i) => i !== index))}
                                                        className="shrink-0"
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            ))}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setImages([...images, ""])}
                                                className="w-full"
                                            >
                                                <ImagePlus className="mr-2 h-4 w-4" />
                                                Add Image URL
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isReporting}
                                className="min-w-[140px]"
                            >
                                {isReporting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        Submit Report
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}