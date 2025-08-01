'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cart';
import { useUserStore } from '@/store/user';
import { createOrder, createOrderItems } from '@/lib/api/order';
import { requireAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import ProtectedPageWrapper from '@/components/ProtectedPageWrapper';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const increaseItem = useCartStore((state) => state.increaseItem);
  const decreaseItem = useCartStore((state) => state.decreaseItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const userId = useUserStore((state) => state.userId);
  const router = useRouter();

  const total = items.reduce((sum, item) => sum + item.quantity * (item.price || 0), 0);
  const [isOrdering, setIsOrdering] = useState(false);

  const handleOrder = async () => {
    const user = await requireAuth();
    if (!user || !userId) {
      router.push('/login');
      return;
    }

    if (items.length === 0) {
      alert('장바구니가 비어있어요.');
      return;
    }

    setIsOrdering(true);

    try {
      const { order, error: orderError } = await createOrder(userId, total);

      if (orderError || !order) throw new Error('주문 생성 실패');

      const itemError = await createOrderItems(order.id, items);

      if (itemError) throw new Error('주문 항목 저장 실패');

      alert('🛒 주문이 완료되었습니다!');
      clearCart();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
        alert(`❌ 주문 실패: ${err.message}`);
      } else {
        console.error(err);
        alert('❌ 주문 실패: 알 수 없는 오류');
      }
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <ProtectedPageWrapper>
      <div className="p-8">
        <h2 className="text-2xl font-semibold mb-6">🛒 장바구니</h2>
        {items.length === 0 && (
          <p className="text-gray-500 text-center">장바구니에 상품이 없습니다.</p>
        )}
        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={item.id}
              className="border-b border-gray-300 p-4 flex justify-between items-center"
            >
              <div>
                <p className="text-lg font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  수량: {item.quantity}개 · 가격: {(item.price! * item.quantity).toLocaleString()}원
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => decreaseItem(item.id)}
                  className="bg-gray-300 text-sm px-2 py-1 rounded"
                >
                  −
                </button>
                <button
                  onClick={() => increaseItem(item.id)}
                  className="bg-gray-300 text-sm px-2 py-1 rounded"
                >
                  ＋
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="bg-red-500 text-white text-sm px-3 py-1 rounded"
                >
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
        {items.length !== 0 && (
          <div className="mt-6">
            <p className="text-[24px] text-right mb-6">총 금액 : {total.toLocaleString()}원</p>
            <button
              onClick={handleOrder}
              disabled={isOrdering}
              className={`w-full px-6 py-2 rounded text-white transition ${
                isOrdering ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isOrdering ? '주문 처리 중...' : '주문하기'}
            </button>
          </div>
        )}
      </div>
    </ProtectedPageWrapper>
  );
}
