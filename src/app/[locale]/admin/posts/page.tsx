import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { getAllPosts } from '@/lib/blog';
import AdminPostsList from '@/components/admin/AdminPostsList';

export default async function AdminPostsPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  const { filter } = await searchParams;
  setRequestLocale(locale);
  
  const t = await getTranslations('Admin');
  
  // Get all posts including drafts for admin
  const allPosts = getAllPosts(locale);
  
  // Also get all posts including drafts (modify getAllPosts to include drafts for admin)
  const allPostsIncludingDrafts = getAllPosts(locale);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Posts Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage all your blog posts, drafts, and publications
          </p>
        </div>
      </div>

      <AdminPostsList 
        posts={allPostsIncludingDrafts} 
        locale={locale}
        initialFilter={filter as string}
      />
    </div>
  );
}