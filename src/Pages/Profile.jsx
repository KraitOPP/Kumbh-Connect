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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Loader, Loader2 } from "lucide-react";
import { useGetProfileMutation, useUpdateProfileMutation } from "@/slices/userApiSlice";
import { toast } from "@/components/ui/use-toast";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/slices/authSlice";
import { useGetUserItemMutation } from "@/slices/itemSlice";
import Items from "@/components/Items";

const userSchemaUpdateValidate = z.object({
    firstName: z.string({ required_error: "First Name is required" }),
    lastName: z.string().optional(),
    phoneNumber: z
        .string({ required_error: "Mobile Number is required" })
        .regex(/^[6-9]\d{9}$/, { message: "Invalid Mobile Number." }),
    email: z
        .string({ required_error: "Email is required" })
        .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, { message: "Invalid Email Address." }),
    address: z.object({
        street: z.string({ required_error: "Street is required" }),
        city: z.string({ required_error: "City is required" }),
        state: z.string({ required_error: "State is required" }),
        country: z.string({ required_error: "Country is required" }),
        postalCode: z.string({ required_error: "Postal Code is required" }),
    }).optional(),
});

export const ProfilePage = () => {
    const dispatch = useDispatch();
    const [getProfile, { isLoading: isFetching }] = useGetProfileMutation();
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
    const [getUserItems, { isLoading: isFetchingItems }] = useGetUserItemMutation();
    const [isEditing, setIsEditing] = useState(false);
    const [items, setItems] = useState([]);

    const form = useForm({
        resolver: zodResolver(userSchemaUpdateValidate),
        defaultValues: {
            firstName: "",
            lastName: "",
            phoneNumber: "",
            email: "",
            address: {
                street: "",
                city: "",
                state: "",
                country: "",
                postalCode: ""
            },
        },
    });

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await getProfile().unwrap();
                form.reset(res.user);
            } catch (error) {
                toast({
                    title: "Failed to load profile",
                    description: error?.data?.message || "An unexpected error occurred.",
                    variant: "destructive",
                });
            }
        }

        fetchProfile();
    }, [getProfile, form]);


    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await getUserItems().unwrap();
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
    }, [getUserItems]);

    async function onSubmit(data) {
        try {
            const res = await updateProfile(data).unwrap();
            if (res.success) {
                toast({
                    title: "Profile Updated Successfully",
                });
                dispatch(setCredentials({ user: res.user, token: res.token }));
                setIsEditing(false);
                form.reset(res.user);
            } else {
                toast({
                    title: "Update Failed",
                    description: res.message,
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Update Failed",
                description: error?.data?.message || "An unexpected error occurred.",
                variant: "destructive",
            });
        }
    }

    return (
        <div className="flex flex-col  bg-gray-100 px-4 py-8 lg:px-24">
            <div>
                {isFetching ? (
                    <div className="flex justify-center">
                        <Loader className="animate-spin text-gray-600" size={40} />
                    </div>
                ) : (
                    <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-lg shadow-md mx-auto">
                        <div className="text-center">
                            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-6">Your Profile</h1>
                        </div>

                        <div className="flex justify-end mb-4">
                            <Button onClick={() => setIsEditing(!isEditing)} variant="outline">
                                {isEditing ? "Cancel" : "Edit Profile"}
                            </Button>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="firstName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>First Name</FormLabel>
                                                <FormControl>
                                                    <Input type="text" placeholder="First Name" {...field} disabled={!isEditing} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="lastName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Last Name</FormLabel>
                                                <FormControl>
                                                    <Input type="text" placeholder="Last Name" {...field} disabled={!isEditing} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phoneNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Mobile Number</FormLabel>
                                                <FormControl>
                                                    <Input type="tel" placeholder="Mobile Number" {...field} disabled={!isEditing} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="Email" {...field} disabled={!isEditing} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="address.street"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Street</FormLabel>
                                                <FormControl>
                                                    <Input type="text" placeholder="Street" {...field} disabled={!isEditing} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="address.city"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>City</FormLabel>
                                                <FormControl>
                                                    <Input type="text" placeholder="City" {...field} disabled={!isEditing} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="address.state"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>State</FormLabel>
                                                <FormControl>
                                                    <Input type="text" placeholder="State" {...field} disabled={!isEditing} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="address.country"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Country</FormLabel>
                                                <FormControl>
                                                    <Input type="text" placeholder="Country" {...field} disabled={!isEditing} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="address.postalCode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Postal Code</FormLabel>
                                                <FormControl>
                                                    <Input type="text" placeholder="Postal Code" {...field} disabled={!isEditing} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {isEditing && (
                                    <div className="flex justify-end">
                                        <Button type="submit" variant="default">
                                            {isUpdating ? <Loader size={20} className="animate-spin" /> : "Save"}
                                        </Button>
                                    </div>
                                )}
                            </form>
                        </Form>
                    </div>
                )}
            </div>

            <div className="w-full mt-8">
                {isFetchingItems ? (
                    <div className="flex justify-center">
                        <Loader className="animate-spin text-gray-600" size={40} />
                    </div>
                ) : (
                    <Items items={items} />
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
