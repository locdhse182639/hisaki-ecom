export interface RatingDistribution {
    rating: number;
    count: number;
  }
  
  export interface Product {
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
  }
  