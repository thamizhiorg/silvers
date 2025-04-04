export interface Product {
  id: string;
  name: string;
  price: number;
  image: any;
  category: string;
  description?: string;
  materials?: string;
  sizes?: number[];
}

export interface Category {
  id: string;
  name: string;
  image: any;
  productCount: number;
}
