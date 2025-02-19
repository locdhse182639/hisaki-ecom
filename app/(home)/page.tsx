import { HomeCarousel } from "@/components/shared/home/home-carousel";
import { HomeCard } from "@/components/shared/home/home-card";
import data from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import ProductSlider from "@/components/shared/product/product-slider";

import { getCategories, getProductsByTag } from "@/features/api/product";
import BrowsingHistoryList from "@/components/shared/browsing-history-list";

const toSlug = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");

export default async function Page() {
  const categories = await getCategories();
  const newArrivals = await getProductsByTag("new-arrival", 4);
  const featureds = await getProductsByTag("featured", 4);
  const bestSellers = await getProductsByTag("best-seller", 4);
  const todaysDeals = await getProductsByTag("todays-deal", 10);
  const bestSellingProducts = await getProductsByTag("best-seller", 10);

  const cards = [
    {
      title: "Categories to explore",
      link: { text: "See More", href: "/search" },
      items: categories?.map((category: string) => ({
        name: category,
        image: `/images/${toSlug(category)}.jpg`,
        href: `/search?category=${category}`,
      })),
    },
    {
      title: "Explore New Arrivals",
      items: newArrivals.map((product) => ({
        name: product.name,
        image: product.images[0] || "/placeholder.jpg",
        href: `/product/${product.slug}`,
      })),
      link: { text: "View All", href: "/search?tag=new-arrival" },
    },
    {
      title: "Discover Best Sellers",
      items: bestSellers.map((product) => ({
        name: product.name,
        image: product.images[0] || "/placeholder.jpg",
        href: `/product/${product.slug}`,
      })),
      link: { text: "View All", href: "/search?tag=best-seller" },
    },
    {
      title: "Featured Products",
      items: featureds.map((product) => ({
        name: product.name,
        image: product.images[0] || "/placeholder.jpg",
        href: `/product/${product.slug}`,
      })),
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

      <div className="p-4 bg-background">
        <BrowsingHistoryList />
      </div>
    </>
  );
}
