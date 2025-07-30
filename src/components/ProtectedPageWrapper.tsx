'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/store/user';
import { getSession } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';

export default function ProtectedPageWrapper({ children }: { children: React.ReactNode }) {
  const setUserId = useUserStore((state) => state.setUserId);
  const router = useRouter();

  useEffect(() => {
    const getUserSession = async () => {
      const { data } = await getSession();
      const user = data.session?.user;
      setUserId(user?.id ?? null);
      if (!user) {
        router.replace('/login'); // 로그인 페이지로 리디렉션
      }
    };

    getUserSession();
  }, [setUserId, router]);

  return <>{children}</>;
}
