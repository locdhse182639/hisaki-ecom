export const FREE_SHIPPING_MIN_PRICE = 35;

export const formatNumberWithDecimal = (num: number): string => {
  const [int, decimal] = num.toString().split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : int;
};

export const round2 = (num: number) =>
  Math.round((num + Number.EPSILON) * 100) / 100;

export const generateId = () =>
  Array.from({ length: 24 }, () => Math.floor(Math.random() * 10)).join("");

export const toSlug = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");

export const calcDeliveryDateAndPrice = async ({
  items,
}: {
  items: { price: number; quantity: number }[];
}) => {
  const FREE_SHIPPING_MIN_PRICE = 35; // Configurable

  const itemsPrice = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingPrice = itemsPrice > FREE_SHIPPING_MIN_PRICE ? 0 : 5;
  const taxPrice = Math.round(itemsPrice * 0.15);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  return {
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  };
};
