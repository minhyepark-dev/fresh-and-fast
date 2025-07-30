'use client';

import { useParams } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Product } from '@/types/product';
import { getProductById } from '@/lib/api/product';
import { productSchema } from '@/schemas/productSchema';
import toCamelCase from '@/lib/toCamelCase';

export default function ProductDetailPage() {
  const { id } = useParams();
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof id !== 'string') return;

    const fetchAndValidate = async () => {
      try {
        const data = await getProductById(id);

        // 유효성 검증 및 camelCase 변환
        const valid = await productSchema.validate(data);
        const camelData = toCamelCase(valid);

        setProduct(camelData);
      } catch (err) {
        console.warn('유효하지 않거나 조회 실패한 상품:', err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAndValidate();
  }, [id]);

  if (!id || typeof id !== 'string') {
    return <div>잘못된 접근입니다.</div>;
  }

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!product) {
    return <div>상품을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">상품 상세</h2>
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="relative w-48 h-48 sm:h-72 sm:w-72">
          <Image
            src={`/images/products/webp/${product?.imageUrl}.webp`}
            alt={product?.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            loading="lazy"
          />
        </div>
        <div>
          <p className="text-xl mb-2">{product.name}</p>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="font-semibold text-green-700 mb-6">{product.price.toLocaleString()}원</p>
          <button
            onClick={() => addItem({ id: product.id, name: product.name })}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            장바구니에 담기
          </button>
        </div>
      </div>
    </div>
  );
}
