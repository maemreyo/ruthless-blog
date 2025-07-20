import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, FolderOpen, Tag, ChartBar } from '@/components/icons/PhosphorIcons';
import { Link } from '@/i18n/navigation';
import { getAllPosts } from '@/lib/blog';

export default async function AdminDashboard({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const t = await getTranslations('Admin');
  
  // Get blog statistics
  const allPosts = getAllPosts(locale);
  const publishedPosts = allPosts.filter(post => !post.draft);
  const draftPosts = allPosts.filter(post => post.draft);
  const featuredPosts = allPosts.filter(post => post.featured);
  
  // Get categories and series
  const categories = [...new Set(allPosts.map(post => post.category).filter(Boolean))];
  const series = [...new Set(allPosts.map(post => post.series).filter(Boolean))];
  
  const stats = [
    {
      title: 'Total Posts',
      value: allPosts.length,
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'Published',
      value: publishedPosts.length,
      icon: FileText,
      color: 'text-green-600'
    },
    {
      title: 'Drafts',
      value: draftPosts.length,
      icon: FileText,
      color: 'text-yellow-600'
    },
    {
      title: 'Categories',
      value: categories.length,
      icon: FolderOpen,
      color: 'text-purple-600'
    },
    {
      title: 'Series',
      value: series.length,
      icon: Tag,
      color: 'text-indigo-600'
    },
    {
      title: 'Featured',
      value: featuredPosts.length,
      icon: ChartBar,
      color: 'text-pink-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your blog content and settings
          </p>
        </div>
        
        <Button asChild>
          <Link href="/admin/posts/create" className="gap-2">
            <Plus className="w-4 h-4" />
            New Post
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Posts Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/posts">
                View All Posts
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/posts/create">
                Create New Post
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/posts?filter=draft">
                Manage Drafts
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5" />
              Content Organization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/categories">
                Manage Categories
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/series">
                Manage Series
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/tags">
                Manage Tags
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartBar className="w-5 h-5" />
              Analytics & Media
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/analytics">
                View Analytics
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/media">
                Media Library
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/settings">
                Site Settings
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {allPosts.slice(0, 5).map((post) => (
              <div key={post.slug} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {post.category} • {post.date}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {post.draft && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      Draft
                    </span>
                  )}
                  {post.featured && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Featured
                    </span>
                  )}
                  <Button size="sm" variant="ghost" asChild>
                    <Link href={`/admin/posts/edit/${post.slug}`}>
                      Edit
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}