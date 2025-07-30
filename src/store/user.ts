import { UserStore } from '@/types/user';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
  persist<UserStore>(
    (set) => ({
      userId: null,
      userEmail: null,
      userImage: null,
      setUserEmail: (email) => set({ userEmail: email }),
      setUserImage: (image) => set({ userImage: image }),
      setUserId: (id) => set({ userId: id }),
      // 초기화 함수
      logout: () => set({ userId: null, userEmail: null, userImage: null }),
    }),
    {
      name: 'user-storage', // localStorage에 저장될 key 이름
    }
  )
);
