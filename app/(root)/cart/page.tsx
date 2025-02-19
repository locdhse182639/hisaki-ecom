"use client";

import BrowsingHistoryList from "@/components/shared/browsing-history-list";
import ProductPrice from "@/components/shared/product/product-price";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { APP_NAME, FREE_SHIPPING_MIN_PRICE } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import useAppDispatch from "@/features/hooks/useAppDispatch";
import {
  fetchCart,
  addItemToCart,
  removeItemFromCart,
  updateItemInCart
} from "@/features/redux/thunks/cartThunks";
import { RootState } from "@/features/redux/store";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { items, itemsPrice, totalPrice, status } = useSelector(
    (state: RootState) => state.cart
  );

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
        {status === "loading" ? (
          <p>Loading cart...</p>
        ) : items.length === 0 ? (
          <Card className="col-span-4 rounded-none">
            <CardHeader className="text-3xl">
              Your Shopping Cart is empty
            </CardHeader>
            <CardContent>
              Continue shopping on <Link href="/">{APP_NAME}</Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="col-span-3">
              <Card className="rounded-none">
                <CardHeader className="text-3xl pb-0">Shopping Cart</CardHeader>
                <CardContent className="p-4">
                  <div className="flex justify-end border-b mb-4">Price</div>
                  {items.map((item) => (
                    <div
                      key={item._id}
                      className="flex flex-col md:flex-row justify-between py-4 border-b gap-4"
                    >
                      <Link href={`/product/${item.slug}`}>
                        <div className="relative w-40 h-40">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="20vw"
                            style={{ objectFit: "contain" }}
                          />
                        </div>
                      </Link>

                      <div className="flex-1 space-y-4">
                        <Link
                          href={`/product/${item.slug}`}
                          className="text-lg hover:no-underline"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm">
                          <span className="font-bold">Color:</span> {item.color}
                        </p>
                        <p className="text-sm">
                          <span className="font-bold">Size:</span> {item.size}
                        </p>

                        <div className="flex gap-2 items-center">
                          <Select
                            value={item.quantity.toString()}
                            onValueChange={(value) =>
                              dispatch(
                                updateItemInCart({
                                  userId: user.id,
                                  itemId: item._id,
                                  quantity: Number(value),
                                })
                              )
                            }
                          >
                            <SelectTrigger className="w-auto">
                              <SelectValue>
                                Quantity: {item.quantity}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent position="popper">
                              {Array.from({ length: item.countInStock }).map(
                                (_, i) => (
                                  <SelectItem key={i + 1} value={`${i + 1}`}>
                                    {i + 1}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                          <Button
                            variant={"outline"}
                            onClick={() =>
                              dispatch(removeItemFromCart(item._id))
                            }
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            <div>
              <Card className="rounded-none">
                <CardContent className="py-4 space-y-4">
                  {itemsPrice < FREE_SHIPPING_MIN_PRICE ? (
                    <div className="flex-1">
                      Add{" "}
                      <span className="text-green-700">
                        <ProductPrice
                          price={FREE_SHIPPING_MIN_PRICE - itemsPrice}
                          plain
                        />
                      </span>{" "}
                      of eligible items to your order to qualify for FREE
                      Shipping.
                    </div>
                  ) : (
                    <div className="flex-1">
                      <span className="text-green-700">
                        Your order qualifies for FREE Shipping.
                      </span>{" "}
                      Choose this option at checkout.
                    </div>
                  )}
                  <div className="text-lg">
                    Subtotal (
                    {items.reduce((acc, item) => acc + item.quantity, 0)}{" "}
                    items):{" "}
                    <span className="font-bold">
                      <ProductPrice price={totalPrice} plain />
                    </span>{" "}
                  </div>
                  <Button
                    onClick={() => router.push("/checkout")}
                    className="rounded-full w-full"
                  >
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
      <BrowsingHistoryList className="mt-10" />
    </div>
  );
}
