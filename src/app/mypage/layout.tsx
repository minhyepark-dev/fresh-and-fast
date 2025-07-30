import ProtectedPageWrapper from '@/components/ProtectedPageWrapper';
import { ReactNode } from 'react';

export default function MypageLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedPageWrapper>
      <section>{children}</section>
    </ProtectedPageWrapper>
  );
}
