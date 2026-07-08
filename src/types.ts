export interface FlavorProfile {
  warmth: number; // 0 to 100
  sweetness: number; // 0 to 100
  aroma: number; // 0 to 100
  intensity: number; // 0 to 100
}

export interface Specifications {
  origin: string;
  grade: string;
  moisture: string;
  organic: boolean;
  packageType: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  isVerified: boolean;
}

export interface Product {
  id: string;
  name: string;
  scientificName: string;
  category: string;
  price: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  story: string;
  flavorProfile: FlavorProfile;
  healthBenefits: string[];
  cookingUses: string[];
  specifications: Specifications;
  certifications: string[];
  stock: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface Recipe {
  id: string;
  name: string;
  image: string;
  description: string;
  prepTime: string;
  cookTime: string;
  difficulty: 'Easy' | 'Medium' | 'Challenging';
  ingredients: string[];
  instructions: string[];
  productsToBuy: string[]; // references to Product.id
  tags: string[];
  servings?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  likes?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  isGiftBox: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  shippingDetails: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    country: string;
    zipCode: string;
    phone: string;
  };
  paymentMethod: string;
  date: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
}
