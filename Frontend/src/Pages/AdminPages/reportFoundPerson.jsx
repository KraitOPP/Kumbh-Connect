import React, { useState, useEffect } from 'react';
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Loader2,
    ImagePlus,
    Trash2,
    User,
    Building,
    AlertTriangle,
    ArrowRight,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useReportFoundPersonMutation } from "@/slices/personSlice";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Separator } from '@/components/ui/separator';
import { useGetStoresQuery } from '@/slices/storeSlice';

const personSchema = z.object({
    name: z
        .string({
            required_error: "Person Name is required",
            invalid_type_error: "Person Name must be a string",
        })
        .min(1, "Person Name is required"),
    description: z
        .string({
            required_error: "Person Description is required",
            invalid_type_error: "Person Description must be a string",
        })
        .min(1, "Person Description is required"),
    age: z.string()
        .nonempty("Age is required")
        .refine((val) => !isNaN(parseInt(val)), "Age must be a number")
        .transform((val) => parseInt(val))
        .refine((val) => val >= 0, "Age must be a positive number")
        .refine((val) => val <= 150, "Age must be reasonable"),
    centre: z.string({
        required_error: "Center is required",
    })
    .min(1, "Center is required"),
    images: z.array(
        z.object({
            url: z.string().min(1, "Image URL is required"),
        }),
    ),
});

const SectionTitle = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-blue-100">
            <Icon className="h-5 w-5 text-blue-500" />
        </div>
        <h2 className="text-xl font-semibold">{title}</h2>
    </div>
);

export default function ReportFoundPersonPage() {
    const navigate = useNavigate();
    const [reportPerson, { isLoading: isReporting }] = useReportFoundPersonMutation();
    const { data, isLoading: isLoadingCentres } = useGetStoresQuery();
    const centres = data?.stores || [];
    const [images, setImages] = useState([""]);

    const form = useForm({
        resolver: zodResolver(personSchema),
        defaultValues: {
            name: "",
            description: "",
            age: "",
            centre: undefined,
            images: [],
        },
    });

    async function onSubmit(data) {
        try {
            const validImages = images
                .map((url) => ({ url: url.trim() }))
                .filter(img => img.url);
            
            if (validImages.length === 0) {
                toast({
                    title: "Validation Error",
                    description: "Please provide at least one image URL",
                    variant: "destructive",
                });
                return;
            }

            const formData = {
                ...data,
                images: validImages,
                age: Number(data.age),
            };
            
            const res = await reportPerson(formData).unwrap();
            if (res.success) {
                toast({ title: "Success!", description: "Person reported successfully" });
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

    const handleAddImage = () => {
        if (images[images.length - 1].trim()) {
            setImages([...images, ""]);
        } else {
            toast({
                title: "Warning",
                description: "Please fill in the current image URL before adding another.",
                variant: "warning",
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Report Found Person</h1>
                    <p className="text-gray-500">Please provide accurate information about the person you found</p>
                </div>

                <Alert className="bg-yellow-50 border-yellow-200">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                        Please ensure you have informed the local authorities before submitting this report.
                    </AlertDescription>
                </Alert>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <Card className="shadow-lg">
                            <CardContent className="p-6 space-y-8">
                                <div>
                                    <SectionTitle icon={User} title="Person Details" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Person's Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Full name" className="bg-white" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="age"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Approximate Age</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="Age in years"
                                                            className="bg-white"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="mt-6">
                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Physical Description</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Height, weight, clothing worn, distinctive features..."
                                                            className="min-h-[120px] bg-white"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <SectionTitle icon={Building} title="Center Information" />
                                    <FormField
                                        control={form.control}
                                        name="centre"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Select Center</FormLabel>
                                                <Select 
                                                    onValueChange={field.onChange} 
                                                    value={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="bg-white">
                                                            <SelectValue placeholder="Select a center" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {isLoadingCentres ? (
                                                            <SelectItem value="loading" disabled>
                                                                Loading centres...
                                                            </SelectItem>
                                                        ) : (
                                                            centres?.map((center) => (
                                                                <SelectItem key={center._id} value={center._id}>
                                                                    {center.name}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Separator />

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
                                                {images.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => setImages(images.filter((_, i) => i !== index))}
                                                        className="shrink-0"
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleAddImage}
                                            className="w-full"
                                        >
                                            <ImagePlus className="mr-2 h-4 w-4" />
                                            Add Image URL
                                        </Button>
                                    </div>
                                </div>

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
                            </CardContent>
                        </Card>
                    </form>
                </Form>
            </div>
        </div>
    );
}