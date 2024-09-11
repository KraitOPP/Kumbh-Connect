import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { useRegisterMutation } from "@/slices/authApiSlice"
import { toast } from "@/components/ui/use-toast"

const registerFormSchema = z.object({
    firstName: z.string().min(1, "Fist Name is required"),
    lastName: z.string().optional(),
    email: z
        .string()
        .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, { message: "Invalid Email Address." }),
    phoneNumber: z
        .string({required_error: "Mobile Number is required"})
        .regex(/^[6-9]\d{9}$/,{message:"Invalid Mobile Number."}),
    password: z
        .string()
        .min(8, { message: "Password must be atleast 8 length" })
})


export const RegisterPage = () => {

    const navigate = useNavigate();
    const [register, {isLoading}] = useRegisterMutation();

    const form = useForm({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            phoneNumber: "",
            email: "",
            password: "",
        },
    })

    async function onSubmit(data) {
        try {
            const res = await register(data).unwrap();
            if (res.success) {
                toast({
                    title: "Registration Successful",
                });
    
                navigate('/user/sign-in',{replace:true});
            } else {
                toast({
                    title: "Registration Failed",
                    description: res.message,
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Registration Failed",
                description: error?.data?.message || "An unexpected error occurred.",
                variant: "destructive",
            });
        }
    }
    

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className='text-center'>
                    <h1 className='text-4xl font-extrabold tracking-tight lg:text-3xl mb-6'>Welcome Back to Lost & Found</h1>
                    <p className='mb-4'>Sign Up to start your adventure</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="First Name" {...field} />
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
                                        <Input type="text" placeholder="Last Name" {...field} />
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
                                        <Input type="tel" placeholder="Mobile Number" {...field} />
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
                                        <Input type="email" placeholder="Email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-center">
                            <Button className="w-full" type="submit" disabled={isLoading}>
                                {
                                    isLoading ?
                                        <>
                                            <Loader2 className="animate-spin mr-2" />Please Wait
                                        </> : <>Sign Up</>
                                }
                            </Button>
                        </div>
                    </form>
                </Form>
                <div className='text-center mt-4'>
                    <p>Already Registered? {' '}
                        <Link to={'/user/sign-in'} className='text-blue-600 hover:text-blue-800'>Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
