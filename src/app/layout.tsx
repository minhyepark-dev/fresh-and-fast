import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Fresh&Fast',
  description: '신선하고 빠른 온라인 장보기',
  openGraph: {
    title: 'Fresh & Fast',
    description: '신선한 과일과 채소를 오늘 안에 배송받으세요.',
    url: 'https://your-site.com',
    siteName: 'Fresh & Fast',
    images: [
      {
        url: 'https://your-site.com/og-image.jpg', // 1200x630 권장
        width: 1200,
        height: 630,
        alt: 'Fresh & Fast 배너',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fresh & Fast',
    description: '신선한 과일과 채소를 오늘 안에 배송받으세요.',
    images: ['https://your-site.com/og-image.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
