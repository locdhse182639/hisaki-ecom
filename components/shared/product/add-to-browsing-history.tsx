"use client";

import { useEffect } from "react";
import useAppDispatch from "@/features/hooks/useAppDispatch";
import { addItem } from "@/features/store/slices/browsingHistorySlice";

export default function AddToBrowsingHistory({
  id,
  category,
}: {
  id: string;
  category: string;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("Dispatching addItem:", { id, category });
    dispatch(addItem({ id, category }));
  }, [id, category, dispatch]);

  return null;
}