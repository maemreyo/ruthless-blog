import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { getAllCategories, getPostsByCategory } from '@/lib/blog';

export default async function CategoriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  // Bật render tĩnh
  setRequestLocale(locale);
  
  const t = await getTranslations('Categories');
  
  // Lấy tất cả categories
  const categories = getAllCategories(locale);
  
  // Lấy số lượng bài viết cho mỗi category
  const categoriesWithCount = categories.map(category => {
    const posts = getPostsByCategory(category as string, locale);
    return {
      name: category,
      count: posts.length
    };
  });
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">{t('title')}</h1>
      
      <div className="max-w-4xl mx-auto">
        <p className="text-gray-600 dark:text-gray-400 text-center mb-12">
          {t('description')}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesWithCount.map((category) => (
            <Link 
              key={category.name as string} 
              href={`/categories/${encodeURIComponent(category.name as string)}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{category.name as string}</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {t('postCount', { count: category.count })}
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