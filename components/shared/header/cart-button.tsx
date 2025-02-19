"use client";

import { ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
import useIsMounted from "@/features/hooks/use-is-mounted";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/features/redux/store";

export default function CartButton() {
  const isMounted = useIsMounted();
  const { items } = useSelector((state: RootState) => state.cart);

  const cartItemsCount = items.reduce((a, c) => a + c.quantity, 0);

  return (
    <Link href="/cart" className="relative px-1 header-button">
      <div className="flex items-end text-xs relative">
        <ShoppingCartIcon className="h-8 w-8" />
        {isMounted && cartItemsCount > 0 && (
          <span
            className={cn(
              `bg-black  px-1 rounded-full text-primary text-base font-bold absolute right-[30px] top-[-4px] z-10`,
              cartItemsCount >= 10 && "text-sm px-0 p-[1px]"
            )}
          >
            {cartItemsCount}
          </span>
        )}
        <span className="font-bold">Cart</span>
      </div>
    </Link>
  );
}
