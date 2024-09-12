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
import { useLoginMutation } from "@/slices/authApiSlice"
import { useDispatch } from "react-redux"
import { setCredentials } from "@/slices/authSlice"
import { toast } from "@/components/ui/use-toast"

const signInSchema = z.object({
    email: z
        .string()
        .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, { message: "Invalid Email Address." }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
})

export const LoginPage = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [login, { isLoading }] = useLoginMutation();

    const form = useForm({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(data) {
        try {
            const res = await login(data).unwrap();
            dispatch(setCredentials(res))
            if (res.success) {
                toast({
                    title: "Login Successful",
                });

                navigate('/',{replace:true})
            } else {
                toast({
                    title: "Login Failed",
                    description: res.message,
                    variant: "destructive",
                });
            }

        } catch (error) {
            toast({
                title: "Login Failed",
                description: error?.data?.message || "An unexpected error occurred.",
                variant: "destructive",
            });
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className='text-center'>
                    <p className='mb-4'>Sign In to Start Your Adventure</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="Email" {...field} />
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
                        <div className="flex justify-center flex-col gap-1">
                            <Button className="w-full" type="submit" disabled={isLoading}>
                                {
                                    isLoading ?
                                        <>
                                            <Loader2 className="animate-spin mr-2" />Please Wait
                                        </> : <>Sign In</>
                                }
                            </Button>
                            <div className="w-full flex justify-end">
                                <p><Link to={'/accounts/forget-password'} className="text-sm text-blue-600 text-bold hover:text-blue-800" >Forget Password ?</Link></p>
                            </div>
                        </div>
                    </form>
                </Form>
                <div className='text-center mt-4'>
                    <p>New to Dashboard? {' '}
                        <Link to={'/accounts/sign-up'} className='text-blue-600 hover:text-blue-800'>Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
