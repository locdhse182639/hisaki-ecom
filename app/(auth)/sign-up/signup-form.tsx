"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { IUserSignUp } from "@/features/redux/types";
import { registerUser } from "@/features/api/auth";
import { registerSuccess } from "@/features/redux/slices/authSlice";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSignUpSchema } from "@/lib/validator";
import { Separator } from "@/components/ui/separator";
import { APP_NAME } from "@/lib/constants";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useSearchParams, useRouter } from "next/navigation";
import useAppDispatch from "@/features/hooks/useAppDispatch";
import { useState } from "react";

const signUpDefaultValues =
  process.env.NODE_ENV === "development"
    ? {
        name: "john doe",
        email: "john@me.com",
        password: "123456",
        confirmPassword: "123456",
      }
    : {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      };

export default function SignUpForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const dispatch = useAppDispatch();
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  const form = useForm<IUserSignUp>({
    resolver: zodResolver(UserSignUpSchema),
    defaultValues: signUpDefaultValues,
  });

  const { control, handleSubmit } = form;


  const onSubmit = async (data: IUserSignUp) => {
    try {
      const response = await registerUser(data.name, data.email, data.password, data.confirmPassword);
      console.log("Sign up response", response);

      if (!response || !response.token || !response.user) {
        throw new Error("Invalid registration response");
      }

      dispatch(registerSuccess({ token: response.token, user: response.user }));

      setEmailSent(true);

      toast({
        title: "Registration Successful!",
        description: "Check your email for verification.",
      });

      router.push(callbackUrl);
    } catch (error) {
      if (isRedirectError(error)) {
        throw error;
      }
      toast({
        title: "Error",
        description: "Failed to register. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit, ()=> console.log("submit"))}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div className="space-y-6">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </div>

          {emailSent && ( // ✅ Show message only if email was sent
            <div className="p-3 text-sm text-green-600 bg-green-100 border border-green-300 rounded-md">
              A verification email has been sent. Please check your inbox.
            </div>
          )}

          <div className="text-sm">
            By creating an account, you agree to {APP_NAME}&apos;s{" "}
            <Link href="/page/conditions-of-use">Conditions of Use</Link> and{" "}
            <Link href="/page/privacy-policy"> Privacy Notice. </Link>
          </div>
          <Separator className="mb-4" />
          <div className="text-sm">
            Already have an account?{" "}
            <Link className="link" href={`/sign-in?callbackUrl=${callbackUrl}`}>
              Sign In
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
}
