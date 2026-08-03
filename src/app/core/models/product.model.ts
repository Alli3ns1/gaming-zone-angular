export type ProductCategory = 'pc' | 'jogo' | 'acessorio';

export interface Product {
  id: number;
  category: ProductCategory;
  name: string; // usado na busca (equivalente ao data-name do HTML original)
  tag: string;
  title: string;
  description: string;
  price: number;
  image: string;
  imageAlt: string;
}
