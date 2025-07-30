'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useCartStore } from '@/store/cart';
import { usePathname, useRouter } from 'next/navigation';
import { useUserStore } from '@/store/user';
import { getCurrentUser, onAuthChange, signOut } from '@/lib/api/auth';

export default function Header() {
  const items = useCartStore((state) => state.items);
  const totalCount = items.length;
  const pathname = usePathname();
  const router = useRouter();

  const userId = useUserStore((state) => state.userId);
  const setUserId = useUserStore((state) => state.setUserId);
  const userLogout = useUserStore((state) => state.logout);

  const isLoginPage = pathname === '/login';

  useEffect(() => {
    // 최초 로그인 유저 정보 확인
    getCurrentUser()
      .then((user) => {
        setUserId(user?.id ?? null);
      })
      .catch(() => {
        setUserId(null);
      });

    // 로그인 상태 변화 감지
    const unsubscribe = onAuthChange((id) => {
      setUserId(id);
    });

    return () => {
      unsubscribe();
    };
  }, [setUserId]);

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      console.error('로그아웃 오류:', error.message);
      return;
    }
    userLogout();
    router.push('/login');
  };

  return (
    <header className="bg-white border-b border-b-gray-200 p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        Fresh&Fast
      </Link>
      <nav className="flex gap-6 items-center">
        <Link href="/products" className="hover:underline">
          상품 목록
        </Link>
        {userId ? (
          <>
            <Link href="/mypage" className="hover:underline">
              마이페이지
            </Link>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:underline cursor-pointer bg-transparent border-none p-0"
            >
              로그아웃
            </button>
            <Link href="/cart" className="relative">
              <span className="block transform scale-x-[-1]">🛒</span>
              {totalCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                  {totalCount}
                </span>
              )}
            </Link>
          </>
        ) : (
          !isLoginPage && (
            <>
              <Link href="/login" className="hover:underline">
                로그인
              </Link>
            </>
          )
        )}
      </nav>
    </header>
  );
}
