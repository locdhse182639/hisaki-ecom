"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { verifyEmail } from "@/features/api/auth";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("Verifying...");

  const verify = async () => {
    if (!token) {
      setStatus("Invalid verification link.");
      return;
    }
    await verifyEmail(token);
    setStatus("Email verified! Redirecting...");
    toast({ title: "Success", description: "Email verified!" });
    setTimeout(() => router.push("/sign-in"), 2000);
  };

  useEffect(() => {
    verify();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2>{status}</h2>
      </div>
    </div>
  );
}
