export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
  likes: number;
}

export interface Props {
  query: 'popular' | 'fruit' | 'vegetable';
}
