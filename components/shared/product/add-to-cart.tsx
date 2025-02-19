// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { addItemToCart } from "@/features/redux/thunks/cartThunks";
// import { useToast } from "@/hooks/use-toast";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import useAppDispatch from "@/features/hooks/useAppDispatch";
// import { RootState } from "@/features/redux";
// import { useSelector } from "react-redux";

// export default function AddToCart({
//   item,
//   minimal = false,
// }: {
//   item: any;
//   minimal?: boolean;
// }) {
//   const router = useRouter();
//   const { toast } = useToast();
//   const [quantity, setQuantity] = useState(1);
//   const dispatch = useAppDispatch();

//   const user = useSelector((state: RootState) => state.auth.user);

//   const handleAddToCart = async () => {
//     if (!user) {
//       toast({ variant: "destructive", description: "Please login first" });
//       return;
//     }

//     try {
//       await dispatch(
//         addItemToCart({ userId: user.id, item: { ...item, quantity } })
//       );
//     } catch (error: any) {
//       console.log(error);
//     }
//   };

//   return minimal ? (
//     <Button
//       className="rounded-full w-auto"
//       onClick={() => {
//         try {
//           handleAddToCart();
//           toast({
//             description: "Added to Cart",
//             action: (
//               <Button
//                 onClick={() => {
//                   router.push("/cart");
//                 }}
//               >
//                 Go to Cart
//               </Button>
//             ),
//           });
//         } catch (error: any) {
//           toast({
//             variant: "destructive",
//             description: error.message,
//           });
//         }
//       }}
//     >
//       Add to Cart
//     </Button>
//   ) : (
//     <div className="w-full space-y-2">
//       <Select
//         value={quantity.toString()}
//         onValueChange={(i) => setQuantity(Number(i))}
//       >
//         <SelectTrigger className="">
//           <SelectValue>Quantity: {quantity}</SelectValue>
//         </SelectTrigger>
//         <SelectContent position="popper">
//           {Array.from({ length: item.countInStock }).map((_, i) => (
//             <SelectItem key={i + 1} value={`${i + 1}`}>
//               {i + 1}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>

//       <Button
//         className="rounded-full w-full"
//         type="button"
//         onClick={async () => {
//           try {
//             const itemId = await handleAddToCart();
//             router.push(`/cart/${itemId}`);
//           } catch (error: any) {
//             toast({
//               variant: "destructive",
//               description: error.message,
//             });
//           }
//         }}
//       >
//         Add to Cart
//       </Button>

//       <Button
//         variant="secondary"
//         onClick={() => {
//           try {
//             handleAddToCart();
//             router.push(`/checkout`);
//           } catch (error: any) {
//             toast({
//               variant: "destructive",
//               description: error.message,
//             });
//           }
//         }}
//         className="w-full rounded-full"
//       >
//         Buy Now
//       </Button>
//     </div>
//   );
// }
