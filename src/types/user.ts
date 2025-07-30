export interface UserStore {
  userId: string | null;
  setUserId: (id: string | null) => void;
  userEmail: string | null;
  setUserEmail: (email: string | null) => void;
  userImage: string | null;
  setUserImage: (image: string | null) => void;
  logout: () => void; // 로그아웃 시 사용자 정보를 초기화하는 함수
}
