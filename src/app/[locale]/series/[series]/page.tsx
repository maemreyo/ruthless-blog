import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { getAllSeries, getPostsBySeries } from '@/lib/blog';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';

interface SeriesPageParams {
  params: Promise<{
    locale: string;
    series: string;
  }>;
}

export default async function SeriesPage({ params }: SeriesPageParams) {
  const { locale, series } = await params;
  const decodedSeries = decodeURIComponent(series);
  
  // Bật render tĩnh
  setRequestLocale(locale);
  
  const t = await getTranslations('Series');
  
  // Lấy tất cả bài viết trong series
  const posts = getPostsBySeries(decodedSeries, locale);
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-2 text-center">{decodedSeries}</h1>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-12">
        {t('seriesDescription', { series: decodedSeries })}
      </p>
      
      <div className="max-w-3xl mx-auto">
        {posts.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold mb-2">{t('seriesParts')}</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {t('totalParts', { count: posts.length })}
              </p>
            </div>
            
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {posts.map((post, index) => (
                <div key={post.slug} className="p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">
                      {post.seriesPart || index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">
                        <Link href={`/blog/${post.slug}`} className="hover:text-primary">
                          {post.title as string}
                        </Link>
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {post.excerpt as string}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <span>{post.date as string}</span>
                        <span className="mx-2">•</span>
                        <span>{post.author as string}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              {t('noPostsInSeries', { series: decodedSeries })}
            </p>
          </div>
        )}
        
        <div className="mt-12 text-center">
          <Link 
            href="/series"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            {t('backToSeries')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  // Tạo tham số tĩnh cho tất cả các series trong cả hai ngôn ngữ
  const enSeries = getAllSeries('en');
  const viSeries = getAllSeries('vi');
  
  const params = [];
  
  // Thêm tham số cho tiếng Anh
  for (const series of enSeries) {
    params.push({
      locale: 'en',
      series: encodeURIComponent(series.name as string)
    });
  }
  
  // Thêm tham số cho tiếng Việt
  for (const series of viSeries) {
    params.push({
      locale: 'vi',
      series: encodeURIComponent(series.name as string)
    });
  }
  
  return params;
}