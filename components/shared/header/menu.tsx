import Link from "next/link";
import React from "react";
import CartButton from "./cart-button";
import UserButton from "./user-button";

export default function Menu() {
  return (
    <div className="flex justify-end">
      <nav className="flex gap-3 w-full">
        <Link href="/sign-in" className="flex items-center header-button">
          - Hello, Sign in -{" "}
        </Link>
        <UserButton />

        <CartButton />
      </nav>
    </div>
  );
}
