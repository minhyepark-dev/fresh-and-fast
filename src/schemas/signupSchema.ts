import * as yup from 'yup';

export const signupSchema = yup.object({
  name: yup.string().required('이름을 입력하세요'),
  email: yup.string().email('유효한 이메일을 입력하세요').required('이메일을 입력하세요'),
  password: yup
    .string()
    .min(6, '비밀번호는 최소 6자 이상이어야 합니다')
    .required('비밀번호를 입력하세요'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], '비밀번호가 일치하지 않습니다')
    .required('비밀번호 확인을 입력하세요'),
});
