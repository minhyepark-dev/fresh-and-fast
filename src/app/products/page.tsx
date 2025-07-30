'use client';

import { useEffect, useState, useRef } from 'react';
import ProductCard from '@/components/ProductCard';
import toCamelCase from '@/lib/toCamelCase';
import { Product } from '@/types/product';
import { productSchema } from '@/schemas/productSchema';
import { fetchProductsByLikes } from '@/lib/api/product';

const LIMIT = 10;

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const startIndexRef = useRef(0);

  const fetchProducts = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const start = startIndexRef.current;
    const end = start + LIMIT - 1;

    const { data, error } = await fetchProductsByLikes(start, end);

    if (error) {
      console.error('상품 불러오기 실패:', error.message);
    } else if (data) {
      const validated = (
        await Promise.all(
          data.map(async (item) => {
            try {
              const valid = await productSchema.validate(item);
              return toCamelCase(valid);
            } catch {
              return null;
            }
          })
        )
      ).filter((p): p is Product => p !== null);

      setProducts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newItems = validated.filter((p) => !existingIds.has(p.id));
        return [...prev, ...newItems];
      });

      startIndexRef.current += LIMIT;

      if (data.length < LIMIT) {
        setHasMore(false);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProducts(); // 최초 1회 호출
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleObserver = (entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting && !loading && hasMore) {
      fetchProducts(); // 여기서는 throttle 없이
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '0px',
      threshold: 0,
    });

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, hasMore]);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">전체 상품</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>

      {loading && <p className="text-center mt-4">불러오는 중...</p>}
      {!hasMore && <p className="text-center mt-4">모든 상품을 불러왔습니다.</p>}

      <div ref={observerRef} className="h-10" />
    </div>
  );
}
