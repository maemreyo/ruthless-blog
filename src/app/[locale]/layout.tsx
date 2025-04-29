import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { SplashProvider } from '@/components/providers/SplashProvider';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Đảm bảo rằng locale đến là hợp lệ
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Bật render tĩnh
  setRequestLocale(locale);

  return (
    <NextIntlClientProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SplashProvider>
          <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </SplashProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}