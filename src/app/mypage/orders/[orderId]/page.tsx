'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchOrderById } from '@/lib/api/order';
import toCamelCase from '@/lib/toCamelCase';
import { OrderItem, OrderWithItems } from '@/types/order';

export default function OrderDetailPage() {
  const { orderId } = useParams() as { orderId: string };
  const [order, setOrder] = useState<OrderWithItems>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await fetchOrderById(orderId);
      if (!error && data) {
        setOrder(toCamelCase(data));
      }
      setLoading(false);
    };

    fetch();
  }, [orderId]);

  if (loading) return <div className="p-6">불러오는 중...</div>;
  if (!order) return <div className="p-6">주문 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">주문 상세 내역</h2>
      <p>주문번호: {order.id}</p>
      <p>주문일자: {order.createdAt?.slice(0, 10)}</p>
      <p className="mb-4">총 금액: {order.totalPrice.toLocaleString()}원</p>

      <h3 className="text-lg font-semibold mb-2">주문한 상품</h3>
      <ul className="space-y-3">
        {order.orderItems.map((item: OrderItem) => (
          <li key={item.id} className="border p-3 rounded">
            <p>상품명: {item.product.name}</p>
            <p>수량: {item.quantity}</p>
            <p>단가: {item.product.price.toLocaleString()}원</p>
            <p>총액: {(item.product.price * item.quantity).toLocaleString()}원</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
