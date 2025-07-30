'use client';

import { useEffect, useState } from 'react';
import { fetchOrdersByUserId } from '@/lib/api/order';
import { Order } from '@/types/order';
import toCamelCase from '@/lib/toCamelCase';
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await fetchOrdersByUserId();

      if (!error && data) {
        const camelData = toCamelCase(data);
        setOrders(camelData);
      }
      setLoading(false);
    };

    fetch();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">주문 내역</h2>
      {loading ? (
        <p>불러오는 중...</p>
      ) : orders.length === 0 ? (
        <p>주문 내역이 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="border p-4 rounded">
              <p>
                주문번호:{' '}
                <Link href={`/mypage/orders/${order.id}`} className="text-blue-600 underline">
                  {order.id}
                </Link>
              </p>
              <p>주문일자: {order.createdAt?.slice(0, 10)}</p>
              <p>총 금액: {order.totalPrice.toLocaleString()}원</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
