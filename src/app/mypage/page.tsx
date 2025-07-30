'use client';

import { useUserStore } from '@/store/user';
import Image from 'next/image';
import Link from 'next/link';

export default function MypageHome() {
  const userEmail = useUserStore((state) => state.userEmail);

  return (
    <div className="p-6">
      <div className="flex justify-center items-center gap-4 mb-6 flex-col">
        <Image src="/images/profile.png" alt="" width={64} height={64} className="object-cover" />
        <p>{userEmail}</p>
      </div>
      <div className="flex justify-center items-center gap-4 mb-6 border-t-gray-200 border-t pt-4">
        <Link href="/mypage/orders">주문내역</Link>
      </div>
    </div>
  );
}
