import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default function HomePage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  
  // Bật render tĩnh
  setRequestLocale(locale);
  
  const t = useTranslations('Index');
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
      <p className="text-xl mb-8">{t('subtitle')}</p>
      <div className="flex gap-4">
        <Link href="/blog" className="px-4 py-2 bg-blue-500 text-white rounded">
          Blog
        </Link>
        <Link href="/about" className="px-4 py-2 bg-gray-200 rounded">
          About
        </Link>
      </div>
    </div>
  );
}