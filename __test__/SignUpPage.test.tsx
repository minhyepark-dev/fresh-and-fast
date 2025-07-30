import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUpPage from '@/app/(auth)/signup/page';
import { useRouter } from 'next/navigation';
import * as userStoreModule from '@/store/user';
import { supabase } from '@/lib/supabaseClient';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
    },
    from: jest.fn(() => ({
      insert: jest.fn(() => ({ error: null })),
    })),
  },
}));

jest.mock('@/store/user', () => ({
  useUserStore: jest.fn() as unknown as jest.Mock,
}));

describe('SignUpPage', () => {
  const mockPush = jest.fn();
  const mockSetUserId = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    jest.spyOn(userStoreModule, 'useUserStore').mockImplementation((selector) =>
      selector({
        userId: null,
        setUserId: mockSetUserId,
        userEmail: null,
        setUserEmail: jest.fn(),
        userImage: null,
        setUserImage: jest.fn(),
        logout: jest.fn(),
      })
    );
  });

  it('renders the signup form', () => {
    render(<SignUpPage />);
    expect(screen.getByRole('heading', { name: '회원가입' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('이름')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('이메일')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('비밀번호')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('비밀번호 확인')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '회원가입' })).toBeInTheDocument();
  });

  it('submits form and calls Supabase signUp', async () => {
    (supabase.auth.signUp as jest.Mock).mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null,
    });

    render(<SignUpPage />);

    fireEvent.change(screen.getByPlaceholderText('이름'), {
      target: { value: '홍길동' },
    });
    fireEvent.change(screen.getByPlaceholderText('이메일'), {
      target: { value: 'raicapark@gmail.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('비밀번호'), {
      target: { value: 'test1234' },
    });
    fireEvent.change(screen.getByPlaceholderText('비밀번호 확인'), {
      target: { value: 'test1234' },
    });

    fireEvent.click(screen.getByRole('button', { name: '회원가입' }));

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'raicapark@gmail.com',
        password: 'test1234',
      });
      expect(mockSetUserId).toHaveBeenCalledWith('test-user-id');
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('shows validation error when password does not match', async () => {
    render(<SignUpPage />);

    fireEvent.change(screen.getByPlaceholderText('비밀번호'), {
      target: { value: 'password123!' },
    });
    fireEvent.change(screen.getByPlaceholderText('비밀번호 확인'), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: '회원가입' }));

    await waitFor(() => {
      expect(screen.getByText('비밀번호가 일치하지 않습니다')).toBeInTheDocument();
    });
  });
});
