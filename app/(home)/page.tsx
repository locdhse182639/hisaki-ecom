import { HomeCarousel } from "@/components/shared/home/home-carousel";
import { HomeCard } from "@/components/shared/home/home-card";
import data from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import ProductSlider from "@/components/shared/product/product-slider";

const fetcher = async (url: string, useLocal = false) => {
  const baseUrl = useLocal
    ? process.env.LOCAL_API_URL // Use local API URL if `useLocal` is true
    : process.env.NEXT_PUBLIC_API_URL; // Otherwise, use the deployed API URL

  const fullUrl = `${baseUrl}${url}`;

  try {
    const res = await fetch(fullUrl);
    if (!res.ok) {
      throw new Error(`Failed to fetch from ${url}: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const toSlug = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");

export default async function Page() {
  const useLocal = process.env.NODE_ENV === "development";

  const categories = await fetcher("/categories", useLocal);
  const newArrivals = await fetcher(
    "/products?tag=new-arrival&limit=4",
    useLocal
  );
  const featureds = await fetcher("/products?tag=featured&limit=4", useLocal);
  const bestSellers = await fetcher(
    "/products?tag=best-seller&limit=4",
    useLocal
  );
  const todaysDeals = await fetcher(
    `/products-by-tag?tag=todays-deal&limit=10`,
    useLocal
  );
  const bestSellingProducts = await fetcher(
    "/products-by-tag?tag=best-seller&limit=10",
    useLocal
  );

  const cards = [
    {
      title: "Categories to explore",
      link: { text: "See More", href: "/search" },
      items: categories.map((category: string) => ({
        name: category,
        image: `/images/${toSlug(category)}.jpg`,
        href: `/search?category=${category}`,
      })),
    },
    {
      title: "Explore New Arrivals",
      items: newArrivals,
      link: { text: "View All", href: "/search?tag=new-arrival" },
    },
    {
      title: "Discover Best Sellers",
      items: bestSellers,
      link: { text: "View All", href: "/search?tag=best-seller" },
    },
    {
      title: "Featured Products",
      items: featureds,
      link: { text: "Shop Now", href: "/search?tag=featured" },
    },
  ];

  return (
    <>
      <HomeCarousel items={data.carousels} />
      <div className="md:p-4 md:space-y-4 bg-border">
        <HomeCard cards={cards} />
        <Card className="w-full rounded-none">
          <CardContent className="p-4 items-center gap-3">
            <ProductSlider title={"Today's Deal"} products={todaysDeals} />
            <ProductSlider
              title="Best Selling Products"
              products={bestSellingProducts}
              hideDetails
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
