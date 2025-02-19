"use client"

import Link from "next/link";
// import { redirect } from "next/navigation";
import SeparatorWithOr from "@/components/shared/separator-or";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import CredentialsSignInForm from "./credentials-signin-form";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { RootState } from "@/features/redux/store";

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const isAuthenticated = useSelector((state: RootState) => !!state.auth.token);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/"); // ✅ Redirect logged-in users
    }
  }, [isAuthenticated, router]);
  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <CredentialsSignInForm />
          </div>
        </CardContent>
      </Card>
      <SeparatorWithOr>New to {APP_NAME}?</SeparatorWithOr>

      <Link href={`/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`}>
        <Button className="w-full" variant="outline">
          Create your {APP_NAME} account
        </Button>
      </Link>
    </div>
  );
}
