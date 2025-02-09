import { HomeCarousel } from "@/components/shared/home/home-carousel";
import { HomeCard } from "@/components/shared/home/home-card";
import data from "@/lib/data";

const fetcher = async (url: string) => {
  try {
    const res = await fetch(url);
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
  const categories = await fetcher(
    `${process.env.NEXT_PUBLIC_API_URL}/categories`
  );
  const newArrivals = await fetcher(
    `${process.env.NEXT_PUBLIC_API_URL}/products?tag=new-arrival&limit=4`
  );
  const featureds = await fetcher(
    `${process.env.NEXT_PUBLIC_API_URL}/products?tag=featured&limit=4`
  );
  const bestSellers = await fetcher(
    `${process.env.NEXT_PUBLIC_API_URL}/products?tag=best-seller&limit=4`
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
      <div>
        <HomeCard cards={cards} />
      </div>
    </>
  );
}
