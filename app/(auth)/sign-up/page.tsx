"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/features/redux/store";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SignUpForm from "./signup-form";

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push(callbackUrl);
    }
  }, [callbackUrl, isAuthenticated, router]);

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create account</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <SignUpForm />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
