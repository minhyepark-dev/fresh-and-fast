import { supabase } from '@/lib/supabaseClient';
import toCamelCase from '@/lib/toCamelCase';
import { productSchema } from '@/schemas/productSchema';
import { Product } from '@/types/product';

export async function fetchProductsByLikes(start: number, end: number) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('likes', { ascending: false })
    .range(start, end);
  return { data, error };
}

export async function getProductById(id: string) {
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();

  if (error) throw new Error(error.message);
  return data;
}

export const fetchProductsByQuery = async (
  query: 'popular' | 'fruit' | 'vegetable'
): Promise<Product[]> => {
  let queryBuilder = supabase.from('products').select('*');

  if (query === 'popular') {
    queryBuilder = queryBuilder.order('likes', { ascending: false }).limit(4);
  } else {
    queryBuilder = queryBuilder.eq('category', query).limit(4);
  }

  const { data, error } = await queryBuilder;

  if (error) {
    console.error('상품 로드 실패:', error.message);
    return [];
  }

  // 유효성 검사 및 camelCase 변환
  const validated = await Promise.all(
    (data ?? []).map(async (item) => {
      try {
        // 이 부분은 productSchema가 있다고 가정
        const valid = await productSchema.validate(item);
        return toCamelCase(valid);
      } catch (e) {
        console.warn('유효하지 않은 상품 데이터:', item, e);
        return null;
      }
    })
  );

  return validated.filter((item): item is Product => !!item); // null 제거
};

export async function likeProduct(productId: string, currentLikeCount: number) {
  const { error } = await supabase
    .from('products')
    .update({ likes: currentLikeCount })
    .eq('id', productId);

  return { error };
}
