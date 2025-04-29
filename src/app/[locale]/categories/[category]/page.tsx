import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { getAllCategories, getPostsByCategory } from '@/lib/blog';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { Calendar, User, ArrowRight } from '@/components/icons/PhosphorIcons';

interface CategoryPageParams {
  params: Promise<{
    locale: string;
    category: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageParams) {
  const { locale, category } = await params;
  const decodedCategory = decodeURIComponent(category);
  
  // Bật render tĩnh
  setRequestLocale(locale);
  
  const t = await getTranslations('Categories');
  
  // Lấy tất cả bài viết trong category
  const posts = getPostsByCategory(decodedCategory, locale);
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-2 text-center">{decodedCategory}</h1>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-12">
        {t('categoryDescription', { category: decodedCategory })}
      </p>
      
      <div className="max-w-5xl mx-auto">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <div key={post.slug} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={post.thumbnail || '/images/placeholder.jpg'}
                    alt={post.title as string}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2">
                    <Link href={`/blog/${post.slug}`} className="hover:text-primary">
                      {post.title as string}
                    </Link>
                  </h2>
                  
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center mr-4">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{post.date as string}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      <span>{post.author as string}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {post.excerpt as string}
                  </p>
                  
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-primary hover:text-primary-dark"
                  >
                    {t('readMore')} <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              {t('noPostsInCategory', { category: decodedCategory })}
            </p>
          </div>
        )}
        
        <div className="mt-12 text-center">
          <Link 
            href="/categories"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            {t('backToCategories')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  // Tạo tham số tĩnh cho tất cả các categories trong cả hai ngôn ngữ
  const enCategories = getAllCategories('en');
  const viCategories = getAllCategories('vi');
  
  const params = [];
  
  // Thêm tham số cho tiếng Anh
  for (const category of enCategories) {
    params.push({
      locale: 'en',
      category: encodeURIComponent(category as string)
    });
  }
  
  // Thêm tham số cho tiếng Việt
  for (const category of viCategories) {
    params.push({
      locale: 'vi',
      category: encodeURIComponent(category as string)
    });
  }
  
  return params;
}