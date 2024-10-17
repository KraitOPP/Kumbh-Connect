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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useReportItemMutation } from "@/slices/itemSlice";
import { useGetItemCategoryMutation } from "@/slices/categorySlice";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const itemSchema = z.object({
    name: z.string().nonempty("Item Name is required"),
    description: z.string().nonempty("Item Description is required"),
    status: z.enum(['lost', 'found'], { message: "Item Status is required" }),
    category: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid Category" }),
    images: z.array(
        z.object({
            url: z.string().url("Invalid Image URL."),
        }),
    ),
    location: z.object({
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
    }),
});

export default function ReportItemPage() {
    const navigate = useNavigate();
    const [reportItem, { isReporting }] = useReportItemMutation();
    const [getItemCategory, { isLoading: isFetchingCategory }] = useGetItemCategoryMutation();
    const [categories, setCategories] = useState([]);
    const [images, setImages] = useState([""]);
    const [location, setLocation] = useState({ latitude: 25.427980726672878, longitude: 81.77186608292688 });

    const form = useForm({
        resolver: zodResolver(itemSchema),
        defaultValues: {
            name: "",
            description: "",
            category: "",
            status: "",
            images: [],
            location: { latitude: 25.427980726672878, longitude: 81.77186608292688 },
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

    // navigator.geolocation.getCurrentPosition(
    //     (position) => {
    //         setLocation({
    //             latitude: position.coords.latitude,
    //             longitude: position.coords.longitude,
    //         });
    //     },
    //     (error) => {
    //         let errorMessage = "Failed to fetch location.";
    //         switch (error.code) {
    //             case 1:
    //                 errorMessage = "Permission to access location was denied.";
    //                 break;
    //             case 2:
    //                 errorMessage = "Position is unavailable. Please try again.";
    //                 break;
    //             case 3:
    //                 errorMessage = "Location request timed out. Try again later.";
    //                 break;
    //             default:
    //                 errorMessage = "An unknown error occurred.";
    //         }

    //         toast({
    //             title: "Error",
    //             description: errorMessage,
    //             variant: "destructive",
    //         });
    //     },
    //     {
    //         enableHighAccuracy: true, 
    //         timeout: 10000, 
    //         maximumAge: 0,
    //     }
    // );
}, []);


    async function onSubmit(data) {
        try {
            data.images = images.map((url) => ({ url: url.trim() }));
            data.location = location;
            const res = await reportItem(data).unwrap();
            if (res.success) {
                toast({ title: "Item Reported Successfully" });
                navigate("/", { replace: true });
            } else {
                toast({
                    title: "Failed to Report Item",
                    description: res.message,
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Failed to Report Item",
                description: error?.data?.message || "An unexpected error occurred.",
                variant: "destructive",
            });
        }
    }

    const addImageField = () => setImages([...images, ""]);
    const removeImageField = (index) => setImages(images.filter((_, i) => i !== index));

    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                setLocation({ latitude: e.latlng.lat, longitude: e.latlng.lng });
            },
        });

        return location.latitude && location.longitude ? (
            <Marker position={[location.latitude, location.longitude]} />
        ) : null;
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            {isFetchingCategory ? (
                <Loader2 className="animate-spin" />
            ) : (
                <div className="w-full max-w-4xl p-6 sm:p-8 space-y-8 bg-white rounded-lg shadow-md">
                    <div className="text-center">
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-6">Report Item</h1>
                        <p className="mb-4">Fill in the details about the lost or found item.</p>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="Name" {...field} />
                                        </FormControl>
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
                                            <Textarea type="text" placeholder="Description" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormItem>
                                <FormLabel>Item Location</FormLabel>
                                <div className="mb-4">
                                    <MapContainer
                                        center={[location.latitude || 0, location.longitude || 0]}
                                        zoom={13}
                                        style={{ height: "300px", width: "100%" }}
                                    >
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        <LocationMarker />
                                    </MapContainer>
                                </div>
                                {/* <Button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigator.geolocation.getCurrentPosition(
                                            (position) => {
                                                setLocation({
                                                    latitude: position.coords.latitude,
                                                    longitude: position.coords.longitude,
                                                });
                                            },
                                            (error) => {
                                                let errorMessage = "Failed to get current location.";
                                                switch (error.code) {
                                                    case 1:
                                                        errorMessage = "Permission to access location was denied.";
                                                        break;
                                                    case 2:
                                                        errorMessage = "Position is unavailable. Please try again.";
                                                        break;
                                                    case 3:
                                                        errorMessage = "Location request timed out. Try again later.";
                                                        break;
                                                    default:
                                                        errorMessage = "An unknown error occurred.";
                                                }

                                                toast({
                                                    title: "Error",
                                                    description: errorMessage,
                                                    variant: "destructive",
                                                });
                                            }
                                        );
                                    }}
                                >
                                    Use Current Location
                                </Button> */}
                            </FormItem>
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="status-select">Item Status</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={(value) => field.onChange(value)} id="status-select">
                                                <SelectTrigger className="w-full sm:w-[180px]">
                                                    <SelectValue placeholder="Select Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="lost">Lost</SelectItem>
                                                    <SelectItem value="found">Found</SelectItem>
                                                </SelectContent>
                                            </Select>
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
                                        <FormLabel htmlFor="category-select">Item Category</FormLabel>
                                        <FormControl>
                                            <Select
                                                id="category-select"
                                                onValueChange={(value) => field.onChange(value)}
                                            >
                                                <SelectTrigger className="w-full sm:w-[180px]">
                                                    <SelectValue placeholder="Select Category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.length > 0 &&
                                                        categories.map((category) => (
                                                            <SelectItem key={category._id} value={category._id}>
                                                                {category.name}
                                                            </SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormItem>
                                <FormLabel className="flex flex-row">Item Images</FormLabel>
                                {images.map((imageField, index) => (
                                    <div key={index} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 items-center mb-2">
                                        <Input
                                            type="text"
                                            placeholder="Image URL"
                                            value={imageField}
                                            onChange={(e) =>
                                                setImages(
                                                    images.map((field, idx) => (idx === index ? e.target.value : field))
                                                )
                                            }
                                        />
                                        <Button type="button" variant="outline" onClick={() => removeImageField(index)}>
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" onClick={addImageField}>
                                    Add Image
                                </Button>
                            </FormItem>
                            <Button type="submit" disabled={isReporting}>
                                {isReporting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Reporting...
                                    </>
                                ) : (
                                    "Report Item"
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            )}
        </div>
    );
}
