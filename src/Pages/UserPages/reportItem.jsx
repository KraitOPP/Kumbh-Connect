import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useReportItemMutation } from "@/slices/itemSlice"
import { useGetItemCategoryMutation } from "@/slices/categorySlice"
import { useEffect, useState } from "react"

const itemSchema = z.object({
    name: z
        .string({
            required_error: "Item Name is required",
            invalid_type_error: "Item Name must be a string",
        }),
    description: z
        .string({
            required_error: "Item Description is required",
            invalid_type_error: "Item Description must be a string",
        }),
    status: z.enum(['lost', 'found'], {
        message: "Item Status is required",
    }),
    category: z
        .string({ required_error: "Category is required" })
        .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid Category" }),
    images: z.array(
        z.object({
            url: z
                .string({ required_error: "Image URL is required" })
                .regex(/^https?:\/\/(www\.)?[\w\-]+\.[\w\-]+(\/[\w\-.,@?^=%&:/~+#]*)?$/, {
                    message: "Invalid Image URL.",
                }),
        }),
    ),
});


export const ReportItemPage = () => {
    const navigate = useNavigate();
    const [reportItem, { isReporting }] = useReportItemMutation();
    const [getItemCategory, { isLoading: isFetchingCategory }] = useGetItemCategoryMutation();
    const [categories, setCategories] = useState([]);
    const [images, setImages] = useState([""]);

    const form = useForm({
        resolver: zodResolver(itemSchema),
        defaultValues: {
            name: "",
            description: "",
            category: "",
            status: "",
            images: [],
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

    async function onSubmit(data) {
        try {
            data.images = images.map((url) => ({ url: url.trim() }));
            const res = await reportItem(data).unwrap();
            if (res.success) {
                toast({ title: "Item Reported Successfully" });
                navigate('/', { replace: true });
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

    const addImageField = () => {
        setImages([...images, ""]);
    }

    const removeImageField = (index) => {
        const newimages = [...images];
        newimages.splice(index, 1);
        setImages(newimages);
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            {isFetchingCategory ? (
                <Loader2 className="animate-spin" />
            ) : (
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                    <div className='text-center'>
                        <h1 className='text-4xl font-extrabold tracking-tight lg:text-3xl mb-6'>Report Item</h1>
                        <p className='mb-4'>Fill in the following details about the lost or found item.</p>
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
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="status-select">Item Status</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={(value) => field.onChange(value)} id="status-select">
                                                <SelectTrigger className="w-[180px]">
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
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Select Category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.length > 0 && categories.map((category) => (
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
                                <FormLabel className='flex flex-row'>Item Images</FormLabel>
                                {images.map((imageField, index) => (
                                    <div key={index} className="flex space-x-4 mb-4">
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder={`Image ${index + 1} Url`}
                                                value={imageField}
                                                onChange={(e) => {
                                                    const newImages = [...images];
                                                    newImages[index] = e.target.value;
                                                    setImages(newImages);
                                                }}
                                            />
                                        </FormControl>
                                        <Button className='w-fit' type="button" onClick={() => removeImageField(index)} variant='destructive'>Remove</Button>
                                    </div>
                                ))}
                                <Button className='' type="button" onClick={addImageField}>Add Image</Button>
                            </FormItem>
                            <div className="flex justify-center">
                                <Button className="w-full" type="submit" disabled={isReporting}>
                                    {isReporting ? (
                                        <>
                                            <Loader2 className="animate-spin mr-2" />Please Wait
                                        </>
                                    ) : (
                                        <>Submit</>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            )}
        </div>
    );
};

