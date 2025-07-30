'use client';

import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/user';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signupSchema } from '@/schemas/signupSchema';
import { RegisterFormValues } from '@/types/auth';
import { registerUserProfile, signUp } from '@/lib/api/auth';

export default function SignUpPage() {
  const router = useRouter();
  const setUserId = useUserStore((state) => state.setUserId);
  const setUserEmail = useUserStore((state) => state.setUserEmail);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(signupSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    const { email, password, name } = data;

    const { data: signupData, error: signupError } = await signUp(email, password);

    if (signupError || !signupData.user) {
      if (signupError?.message.includes('already registered')) {
        alert('이미 등록된 이메일입니다.');
      } else {
        alert('회원가입 실패: ' + signupError?.message);
      }
      return;
    }

    const profileError = await registerUserProfile(signupData.user.id, name, email);

    if (profileError) {
      alert('유저 정보 저장 실패: ' + profileError.message);
      return;
    }

    alert('회원가입 성공!');
    setUserId(signupData.user.id);
    setUserEmail(email);
    router.push('/');
  };

  return (
    <div className="w-100 p-8 space-y-4">
      <h2 className="text-xl font-bold text-center">회원가입</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <input
            {...register('name')}
            type="text"
            placeholder="이름"
            className="w-full border p-2 rounded"
          />
          <p className="text-red-500 text-sm">{errors.name?.message}</p>
        </div>
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
        <div className="space-y-1">
          <input
            {...register('confirmPassword')}
            type="password"
            placeholder="비밀번호 확인"
            className="border p-2 rounded w-full"
          />
          <p className="text-red-500 text-sm">{errors.confirmPassword?.message}</p>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded w-full">회원가입</button>
      </form>
    </div>
  );
}
