"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/features/redux/store";
import useAppDispatch from "@/features/hooks/useAppDispatch";
import { fetchBrowsingHistoryProducts } from "@/features/redux/thunks/browsingHistoryThunks";
import ProductSlider from "./product/product-slider";
import { Separator } from "../ui/separator";

export default function BrowsingHistoryList({
  className,
}: {
  className?: string;
}) {
  const { products } = useSelector((state: RootState) => state.browsingHistory);

  return (
    products.length !== 0 && (
      <div className="bg-background">
        <Separator className={`mb-4 ${className}`} />
        <ProductList
          title="Related to items that you've viewed"
          type="related"
        />
        <Separator className="mb-4" />
        <ProductList title="Your browsing history" type="history" hideDetails />
      </div>
    )
  );
}

function ProductList({
  title,
  type = "history",
  hideDetails = false,
  excludeId = "",
}: {
  title: string;
  type: "history" | "related";
  excludeId?: string;
  hideDetails?: boolean;
}) {
  const { products } = useSelector((state: RootState) => state.browsingHistory);
  const dispatch = useAppDispatch();
  const [data, setData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const fetchProducts = async () => {
        const uniqueCategories = Array.from(
          new Set(products.map((p) => p.category))
        );
        const uniqueIds = Array.from(new Set(products.map((p) => p.id)));

        const response = await dispatch(
          fetchBrowsingHistoryProducts({
            type,
            categories: uniqueCategories,
            ids: uniqueIds,
          })
        );

        if (fetchBrowsingHistoryProducts.fulfilled.match(response)) {
          setData(response.payload); // Update with fetched data
        } else {
          console.error("Error fetching products:", response.error);
        }
      };

      fetchProducts();
    }
  }, [products, type, excludeId, dispatch]);

  return (
    data.length > 0 && (
      <ProductSlider title={title} products={data} hideDetails={hideDetails} />
    )
  );
}
