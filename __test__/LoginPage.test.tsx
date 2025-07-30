import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/(auth)/login/page';
import { useRouter } from 'next/navigation';
import * as userStoreModule from '@/store/user';
import { supabase } from '@/lib/supabaseClient';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
    },
  },
}));

jest.mock('@/store/user', () => ({
  useUserStore: jest.fn(),
}));

describe('LoginPage', () => {
  const mockPush = jest.fn();
  const mockSetUserId = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    // Zustand selector 함수 지원
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form elements', () => {
    render(<LoginPage />);
    expect(screen.getByRole('heading', { name: '로그인' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('이메일')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('비밀번호')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument();
  });

  it('shows validation error when fields are empty', async () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole('button', { name: '로그인' }));

    await waitFor(() => {
      expect(screen.getByText('이메일을 입력하세요')).toBeInTheDocument();
      expect(screen.getByText('비밀번호를 입력하세요')).toBeInTheDocument();
    });
  });

  it('calls supabase.auth.signInWithPassword on valid submit', async () => {
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null,
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText('이메일'), {
      target: { value: 'raicapark@gmail.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('비밀번호'), {
      target: { value: 'test1234' },
    });

    fireEvent.click(screen.getByRole('button', { name: '로그인' }));

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'raicapark@gmail.com',
        password: 'test1234',
      });
      expect(mockSetUserId).toHaveBeenCalledWith('test-user-id');
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('shows alert on login failure', async () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: 'Invalid credentials' },
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText('이메일'), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('비밀번호'), {
      target: { value: 'wrongpass' },
    });

    fireEvent.click(screen.getByRole('button', { name: '로그인' }));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('로그인 실패: Invalid credentials');
    });

    alertMock.mockRestore();
  });
});
