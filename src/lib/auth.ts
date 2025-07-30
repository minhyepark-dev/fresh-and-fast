import { getCurrentUser } from './api/auth';

export const requireAuth = async () => {
  const user = await getCurrentUser();
  if (!user) {
    alert('로그인이 필요합니다.');
    return null;
  }
  return user;
};
