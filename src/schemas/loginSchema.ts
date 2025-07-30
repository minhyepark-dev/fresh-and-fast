import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup.string().email('유효한 이메일을 입력하세요').required('이메일을 입력하세요'),
  password: yup
    .string()
    .required('비밀번호를 입력하세요')
    .min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
});
