import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('NotFound');
  
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-6xl font-bold mb-4">{t('title')}</h1>
      <h2 className="text-2xl mb-8">{t('subtitle')}</h2>
      <p className="text-lg mb-8">{t('description')}</p>
      <div className="flex justify-center gap-4">
        <Link 
          href="/" 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('backToHome')}
        </Link>
        <Link 
          href="/blog" 
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          {t('viewBlog')}
        </Link>
      </div>
    </div>
  );
}