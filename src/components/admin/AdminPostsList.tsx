'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface Post {
  slug: string;
  title: string;
  date: string;
  draft?: boolean;
}

interface AdminPostsListProps {
  posts: Post[];
  locale: string;
  initialFilter: string;
}

export default function AdminPostsList({ posts, locale, initialFilter }: AdminPostsListProps) {
  const [filter, setFilter] = useState(initialFilter || 'all');

  const filteredPosts = useMemo(() => {
    if (filter === 'all') {
      return posts;
    } else if (filter === 'drafts') {
      return posts.filter(post => post.draft);
    } else if (filter === 'published') {
      return posts.filter(post => !post.draft);
    }
    return posts;
  }, [posts, filter]);

  return (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
          All Posts
        </h3>
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
            }`}
          >
            All ({posts.length})
          </button>
          <button
            onClick={() => setFilter('published')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              filter === 'published' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
            }`}
          >
            Published ({posts.filter(p => !p.draft).length})
          </button>
          <button
            onClick={() => setFilter('drafts')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              filter === 'drafts' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
            }`}
          >
            Drafts ({posts.filter(p => p.draft).length})
          </button>
        </div>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700">
        <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <li key={post.slug} className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400 truncate">
                    <Link href={`/${locale}/admin/posts/${post.slug}`}>
                      {post.title} {post.draft && <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Draft</span>}
                    </Link>
                  </p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      {post.date}
                    </p>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-4 sm:px-6 text-center text-gray-500 dark:text-gray-400">
              No posts found.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
