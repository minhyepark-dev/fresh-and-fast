import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { Product, Props } from '@/types/product';
import { fetchProductsByQuery } from '@/lib/api/product';

export default function ProductSection({ query }: Props) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const load = async () => {
      const products = await fetchProductsByQuery(query);
      setProducts(products);
    };

    load();
  }, [query]);

  return (
    <section className="mb-12">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
