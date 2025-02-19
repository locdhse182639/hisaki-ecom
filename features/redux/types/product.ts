export interface RatingDistribution {
  rating: number;
  count: number;
}

export interface Product {
  _id: string; // Added _id field for unique identification
  name: string;
  slug: string;
  category: string;
  images: string[];
  brand: string;
  description: string;
  price: number;
  listPrice: number;
  countInStock: number;
  tags: string[];
  sizes: string[];
  colors: string[];
  avgRating: number;
  numReviews: number;
  numSales: number;
  isPublished: boolean;
  ratingDistribution: RatingDistribution[];
  createdAt: string; // ISO string for the creation timestamp
  updatedAt: string; // ISO string for the last updated timestamp
}
