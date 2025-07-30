'use client';

import ProductSection from '@/components/ProductSection';
import BannerSwiper from '@/components/BannerSwiper';

export default function HomePage() {
  return (
    <>
      <BannerSwiper />
      <div className="container mx-auto p-4">
        <section>
          <h2 className="text-xl font-semibold mb-4">🥇 인기 상품</h2>
          <ProductSection query="popular" />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">🍎 과일</h2>
          <ProductSection query="fruit" />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">🥬 채소</h2>
          <ProductSection query="vegetable" />
        </section>
      </div>
    </>
  );
}
