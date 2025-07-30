'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { useState } from 'react';
import { Product } from '@/types/product';
import { requireAuth } from '@/lib/auth';
import { useUserStore } from '@/store/user';
import { likeProduct } from '@/lib/api/product';
import throttle from 'lodash/throttle';
import { useRouter } from 'next/navigation';

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const [likeCount, setLikeCount] = useState(product?.likes);
  const [isLiking, setIsLiking] = useState(false);
  const router = useRouter();
  const userId = useUserStore((state) => state.userId);

  if (!product) return null;

  const handleLike = async () => {
    const user = await requireAuth();
    if (!user || !userId) {
      router.push('/login');
      return;
    }
    if (isLiking) return;

    setIsLiking(true);

    const newLikeCount = likeCount + 1;
    setLikeCount(newLikeCount); // 👍 먼저 UI에 반영

    const { error } = await likeProduct(product.id, newLikeCount);

    if (error) {
      console.error('좋아요 실패:', error.message);
      setLikeCount((prev) => prev - 1); // 실패 시 롤백
    }

    setIsLiking(false);
  };

  const throttledHandleLike = throttle(handleLike, 1000);

  const handleAddToCart = async () => {
    const user = await requireAuth();
    if (!user || !userId) {
      router.push('/login');
      return;
    }
    addItem(product);
  };

  return (
    <div className="relative">
      <Link href={`/products/${product?.id}`}>
        <div className="relative w-full h-48 sm:h-72">
          <Image
            src={`/images/products/webp/${product?.imageUrl}.webp`}
            alt={product?.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            loading="lazy"
          />
        </div>
        <div className="p-4 space-y-1">
          <h3 className="text-lg font-semibold">{product?.name}</h3>
          <p className="text-gray-700 text-md">{product?.price.toLocaleString()}원</p>
        </div>
      </Link>
      <button
        onClick={throttledHandleLike}
        disabled={isLiking}
        className="flex items-center gap-1 text-sm text-pink-600 hover:text-pink-700"
      >
        ❤️ {likeCount}
      </button>
      <div className="px-4 pb-4 absolute bottom-0 right-0">
        <button onClick={handleAddToCart}>
          <span className="block transform scale-x-[-1]">🛒</span>
        </button>
      </div>
    </div>
  );
}
