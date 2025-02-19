import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/features/redux/store";

export default function CheckoutPage() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!user) {
      router.push("/sign-in?callbackUrl=/checkout");
    }
  }, [user, router]);

  return <div>Checkout Form</div>;
}
