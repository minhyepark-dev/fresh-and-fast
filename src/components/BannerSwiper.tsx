'use client';

import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper as SwiperClass } from 'swiper/types';
import Link from 'next/link';
import Image from 'next/image';

const banners = [
  {
    id: 1,
    title: '🍎 제철 과일 할인',
    description: '신선하고 달콤한 사과, 배, 감귤을 특별가로 만나보세요!',
    imageUrl: '/images/banner-fruit.jpg',
    cta: '과일 보러가기',
    href: '/products?category=fruits',
  },
  {
    id: 2,
    title: '🥬 친환경 채소 모음',
    description: '무농약 인증 받은 상추, 시금치, 양배추!',
    imageUrl: '/images/banner-vegetable.jpg',
    cta: '채소 구경하기',
    href: '/products?category=vegetables',
  },
  {
    id: 3,
    title: '🔥 이번 주 베스트',
    description: '가장 많이 팔린 인기 상품을 만나보세요!',
    imageUrl: '/images/banner-best.jpg',
    cta: '베스트 상품 보기',
    href: '/products?sort=popular',
  },
];

export default function BannerSwiper() {
  const swiperRef = useRef<SwiperClass | null>(null);
  return (
    <div className="relative">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3500 }}
        loop
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        className="mb-8 h-56 md:h-72 lg:h-100"
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={banner.id}>
            <div className="relative w-full h-full overflow-hidden">
              {/* 배경 이미지 */}
              <Image
                src={banner.imageUrl}
                alt={banner.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                priority={index === 0}
                loading={index === 0 ? 'eager' : 'lazy'}
              />

              {/* 어두운 오버레이 */}
              <div className="absolute inset-0 bg-black/35" />

              {/* 텍스트 컨텐츠 */}
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4">
                <h2 className="text-2xl md:text-4xl font-bold mb-2">{banner.title}</h2>
                <p className="text-sm md:text-base mb-4 max-w-xl">{banner.description}</p>
                <Link
                  href={banner.href}
                  className="px-4 py-2 bg-white rounded text-gray-700 text-sm"
                >
                  {banner.cta}
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* 좌우 커스텀 버튼 */}
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white w-10 h-10 rounded-full shadow hover:bg-gray-100 flex items-center justify-center z-10"
      >
        ◀
      </button>
      <button
        onClick={() => swiperRef.current?.slideNext()}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white w-10 h-10 rounded-full shadow hover:bg-gray-100 flex items-center justify-center z-10"
      >
        ▶
      </button>
    </div>
  );
}
