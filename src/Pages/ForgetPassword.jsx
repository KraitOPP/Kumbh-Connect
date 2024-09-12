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
import { useForgetPasswordMutation, useSendVerifyCodeMutation } from "@/slices/authApiSlice"
import { toast } from "@/components/ui/use-toast"
import { useState, useEffect } from "react"

const forgetPassSchema = z.object({
    email: z
        .string()
        .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, { message: "Invalid Email Address." }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" }),
    verifyCode: z
        .string({ required_error: "Verification Code is required" })
        .length(6, { message: "Verification Code must be of 6 length." }),
})

export const ForgetPasswordPage = () => {
    const navigate = useNavigate();
    const [forgetPassword, { isLoading }] = useForgetPasswordMutation();
    const [sendVerifyCode] = useSendVerifyCodeMutation();

    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isSendingCode, setIsSendingCode] = useState(false);
    const [timer, setTimer] = useState(0);
    const form = useForm({
        resolver: zodResolver(forgetPassSchema),
        defaultValues: {
            email: "",
            password: "",
            verifyCode: "",
        },
    });

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    async function onSubmit(data) {
        try {
            const res = await forgetPassword(data).unwrap();
            if (res.success) {
                toast({
                    title: "Password Updated Successfully",
                });
                navigate('/accounts/sign-in', { replace: true });
            } else {
                toast({
                    title: "Failed to forget Password",
                    description: res.message,
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Failed to forget Password",
                description: error?.data?.message || "An unexpected error occurred.",
                variant: "destructive",
            });
        }
    }

    const handleSendCode = async (e) => {
        const email = form.getValues("email");
        if (!email) {
            toast({
                title: "Error",
                description: "Please enter your email before sending the code.",
                variant: "destructive",
            });
            return;
        }
        try {
            setIsSendingCode(true);
            const res = await sendVerifyCode({ email }).unwrap();
            if (res.success) {
                setIsCodeSent(true);
                setTimer(60);
                toast({
                    title: "Verification code sent",
                    description: "Please check your email for the verification code.",
                });
            } else {
                toast({
                    title: "Failed to send verification code",
                    description: res.message || "An unexpected error occurred.",
                    variant: "destructive",
                });
            }

        } catch (error) {
            toast({
                title: "Failed to send verification code",
                description: error?.data?.message || "An unexpected error occurred.",
                variant: "destructive",
            });
        } finally {
            setIsSendingCode(false);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className='text-center'>
                    <p className='mb-4'>Forget Password</p>
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
                                        <Input type="password" placeholder="New Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-8">
                                <FormField
                                    control={form.control}
                                    name="verifyCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input type="text" disabled={!isCodeSent} placeholder="Enter Verification Code" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button
                                className='col-span-4'
                                type="button"
                                onClick={handleSendCode}
                                disabled={timer > 0}
                            >
                                {isSendingCode ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2" />
                                    </>
                                ) : (
                                    <>{timer > 0 ? `Resend in ${timer}s` : "Send Code"}</>
                                )}
                            </Button>
                        </div>
                        <div className="flex justify-center flex-col gap-1">
                            <Button className="w-full" type="submit" disabled={!isCodeSent || isLoading}>
                                {isLoading ? (
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
                <div className='text-center mt-4'>
                    <p>New to Dashboard? {' '}
                        <Link to={'/accounts/sign-up'} className='text-blue-600 hover:text-blue-800'>Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
