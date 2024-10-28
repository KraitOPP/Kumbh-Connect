import React, { useEffect, useState } from 'react';
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
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Loader2, MapPin, Image as ImageIcon, Plus, Minus, Navigation } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { useReportItemMutation } from "@/slices/itemSlice";
import { useGetItemCategoryMutation } from "@/slices/categorySlice";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import "leaflet/dist/leaflet.css";

const itemSchema = z.object({
    name: z.string().nonempty("Item Name is required"),
    description: z.string().nonempty("Item Description is required"),
    status: z.enum(['lost', 'found'], { message: "Item Status is required" }),
    category: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid Category" }),
    images: z.array(z.object({ url: z.string().url("Invalid Image URL.") })),
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
    const [getItemCategory, { isLoading: isFetchingCategory }] = useGetItemCategoryMutation();
    const [categories, setCategories] = useState([]);
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

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getItemCategory().unwrap();
                setCategories(res.categories);
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to get Categories. Please Try Again Later",
                    variant: "destructive",
                });
            }
        };
        fetchCategories();
    }, []);

    // const getCurrentLocation = () => {
    //     navigator.geolocation.getCurrentPosition(
    //         (position) => {
    //             setLocation({
    //                 latitude: position.coords.latitude,
    //                 longitude: position.coords.longitude,
    //             });
    //             toast({
    //                 title: "Success",
    //                 description: "Current location obtained successfully",
    //             });
    //         },
    //         (error) => {
    //             let errorMessage = "Failed to fetch location.";
    //             switch (error.code) {
    //                 case 1:
    //                     errorMessage = "Permission to access location was denied.";
    //                     break;
    //                 case 2:
    //                     errorMessage = "Position is unavailable. Please try again.";
    //                     break;
    //                 case 3:
    //                     errorMessage = "Location request timed out. Try again later.";
    //                     break;
    //                 default:
    //                     errorMessage = "An unknown error occurred.";
    //             }
    //             toast({
    //                 title: "Error",
    //                 description: errorMessage,
    //                 variant: "destructive",
    //             });
    //         },
    //         {
    //             enableHighAccuracy: true,
    //             timeout: 10000,
    //             maximumAge: 0,
    //         }
    //     );
    // };

    async function onSubmit(data) {
        try {
            data.images = images.map((url) => ({ url: url.trim() })).filter(img => img.url);
            data.location = location;
            const res = await reportItem(data).unwrap();
            if (res.success) {
                toast({ title: "Success!", description: "Item reported successfully" });
                navigate("/", { replace: true });
            } else {
                toast({
                    title: "Error",
                    description: res.message,
                    variant: "destructive",
                });
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
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl text-center font-bold">Report Item</CardTitle>
                    <CardDescription className="text-center">
                        Provide details about the lost or found item
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Item Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter item name" {...field} />
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
                                                    <SelectTrigger>
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
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea 
                                                placeholder="Provide detailed description of the item"
                                                className="min-h-[100px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select onValueChange={field.onChange}>
                                            <FormControl>
                                                <SelectTrigger>
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

                            <div className="space-y-4">
                                <FormLabel>Location</FormLabel>
                                <div className="h-[300px] rounded-lg overflow-hidden border">
                                    <MapContainer
                                        center={[location.latitude, location.longitude]}
                                        zoom={13}
                                        style={{ height: "100%", width: "100%" }}
                                        className='z-[0]'
                                    >
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        <LocationMarker location={location} setLocation={setLocation} />
                                    </MapContainer>
                                </div>
                                {/* <Button
                                    type="button"
                                    variant="outline"
                                    onClick={getCurrentLocation}
                                    className="w-full sm:w-auto"
                                >
                                    <Navigation className="mr-2 h-4 w-4" />
                                    Use Current Location
                                </Button> */}
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <FormLabel>Images</FormLabel>
                                <div className="space-y-4">
                                    {images.map((url, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                type="text"
                                                placeholder="Enter image URL"
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
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setImages([...images, ""])}
                                        className="w-full"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Image URL
                                    </Button>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={isReporting}
                                    className="w-full sm:w-auto"
                                >
                                    {isReporting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>Submit Report</>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}