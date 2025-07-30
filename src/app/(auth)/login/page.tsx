'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/user';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '@/schemas/loginSchema';
import { LoginFormValues } from '@/types/auth';
import { signIn } from '@/lib/api/auth';

export default function LoginPage() {
  const router = useRouter();
  const setUserId = useUserStore((state) => state.setUserId);
  const setUserEmail = useUserStore((state) => state.setUserEmail);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    const { email, password } = data;
    const { data: userData, error } = await signIn(email, password);

    if (error) {
      alert('로그인 실패: ' + error.message);
    } else if (userData.user) {
      localStorage.setItem('userId', userData.user.id);
      setUserId(userData.user.id);
      setUserEmail(email);
      router.push('/');
    }
  };

  return (
    <div className="w-100 p-8 space-y-4">
      <h2 className="text-xl font-bold text-center">로그인</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <input
            {...register('email')}
            type="email"
            placeholder="이메일"
            className="border p-2 rounded w-full"
          />
          <p className="text-red-500 text-sm">{errors.email?.message}</p>
        </div>
        <div className="space-y-1">
          <input
            {...register('password')}
            type="password"
            placeholder="비밀번호"
            className="border p-2 rounded w-full"
          />
          <p className="text-red-500 text-sm">{errors.password?.message}</p>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          로그인
        </button>
      </form>
      <Link href="/signup" className="ext-center flex justify-center items-center gap-2">
        <span className="text-xs">아직 회원이 아니신가요?</span>
        <span className="text-sm text-blue-600 hover:underline">회원가입</span>
      </Link>
    </div>
  );
}
