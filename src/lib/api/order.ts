import { supabase } from '@/lib/supabaseClient';

export async function createOrder(userId: string, totalPrice: number) {
  const { data, error } = await supabase
    .from('orders')
    .insert([{ user_id: userId, total_price: totalPrice }])
    .select()
    .single();
  return { order: data, error };
}

export async function createOrderItems(
  orderId: string,
  items: { id: string; quantity: number; price?: number }[]
) {
  const orderItems = items.map((item) => ({
    order_id: orderId,
    product_id: item.id,
    quantity: item.quantity,
    price: item.price || 0,
  }));

  const { error } = await supabase.from('order_items').insert(orderItems);
  return error;
}

export async function fetchOrdersByUserId() {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) return { data: null, error: '로그인이 필요합니다.' };

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userData?.user.id)
    .order('created_at', { ascending: false });

  return { data, error };
}

// 주문 ID로 상세 주문 조회
export async function fetchOrderById(orderId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(
      `
    *,
    order_items(
      *,
      product:products(name, price, image_url) 
    )
  `
    )
    .eq('id', orderId)
    .single();
  return { data, error };
}
