# 🛒 Fresh&Fast

Next.js + Supabase 기반의 미니 커머스 프로젝트

![메인 배너](https://github.com/minhyepark-dev/fresh-and-fast/blob/main/public/images/og-image.jpg?raw=true)

## 🚀 소개

Fresh&Fast는 **간단한 온라인 커머스 기능**을 구현한 사이드 프로젝트입니다.  
상품 조회, 장바구니, 주문, 마이페이지, 회원가입/로그인 등 **기본적인 전자상거래 흐름**을 구현했습니다.

## ✨ 주요 기능

- **메인 페이지**
  - 메인 배너, 추천 상품 리스트
- **상품 목록 페이지**
  - 무한 스크롤로 상품 불러오기
- **상품 상세 페이지**
  - Supabase 연동
  - 좋아요 기능 (Optimistic UI)
- **장바구니 페이지**
  - Zustand 상태 관리
  - 상품 추가/삭제, 수량 조절
- **주문 기능**
  - Supabase RLS 적용 (로그인 유저만 가능)
- **마이페이지**
  - 주문 내역, 주문 상세 조회
- **회원가입/로그인**
  - Supabase Auth
  - react-hook-form + yup 유효성 검사
  - 로그인 상태 유지 (Zustand persist)
- **테스트 코드**
  - Jest + React Testing Library
- **리팩토링 및 성능개선**
  - API 호출 공통화
  - 이미지 webp 변환
  - 좋아요 Optimistic UI
  - 무한 스크롤 throttle 적용
- **SEO**
  - 오픈그래프(OG) 이미지 적용

---

## 🛠 기술 스택

- **Frontend**: [Next.js 14](https://nextjs.org/), [React](https://react.dev/)
- **Backend**: [Supabase](https://supabase.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Form & Validation**: [react-hook-form](https://react-hook-form.com/), [Yup](https://github.com/jquense/yup)
- **Testing**: [Jest](https://jestjs.io/), [React Testing Library](https://testing-library.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Other**: Lodash(throttle), Sharp(webp 변환)

---

## 📂 폴더 구조

```bash
fresh-and-fast/
├── app/                 # Next.js App Router 페이지
│   ├── page.tsx         # 메인 페이지
│   ├── products/        # 상품 목록/상세
│   ├── cart/            # 장바구니
│   ├── mypage/          # 마이페이지
│   ├── login/           # 로그인
│   └── signup/          # 회원가입
├── components/          # 공통 컴포넌트
├── lib/                 # API 호출, 유틸 함수
├── store/               # Zustand 상태관리
├── types/               # 타입 정의
├── public/              # 정적 파일
└── ...
```
