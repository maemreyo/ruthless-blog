import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { getAllSeries } from '@/lib/blog';

export default async function SeriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  // Bật render tĩnh
  setRequestLocale(locale);
  
  const t = await getTranslations('Series');
  
  // Lấy tất cả series
  const series = getAllSeries(locale);
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">{t('title')}</h1>
      
      <div className="max-w-4xl mx-auto">
        <p className="text-gray-600 dark:text-gray-400 text-center mb-12">
          {t('description')}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {series.map((item) => (
            <Link 
              key={item.name as string} 
              href={`/series/${encodeURIComponent(item.name as string)}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{item.name as string}</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {t('partCount', { count: item.count })}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// Generate static params for the page
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'vi' }];
}