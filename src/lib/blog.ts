import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Define the Post type
export interface Post {
  slug: string;
  frontmatter: {
    title: string;
    date: string;
    category: string;
    series?: string;
    seriesPart?: number;
    excerpt: string;
    author: string;
    thumbnail: string;
    tags: string[];
    draft?: boolean;
    featured?: boolean;
  };
  content: string;
}

export interface PostData {
  slug: string;
  title: string;
  date: string;
  category: string;
  series?: string;
  seriesPart?: number;
  excerpt: string;
  author: string;
  thumbnail: string;
  tags: string[];
  draft?: boolean;
  featured?: boolean;
}

// Đường dẫn đến thư mục chứa các bài viết
const getContentDirectory = (locale: string) => {
  return path.join(process.cwd(), 'src', 'content', 'blog', locale);
};

// Lấy tất cả các slug của bài viết
export const getAllPostSlugs = (locale: string = 'vi'): { params: { slug: string } }[] => {
  try {
    const contentDir = getContentDirectory(locale);
    
    // Kiểm tra xem thư mục có tồn tại không
    if (!fs.existsSync(contentDir)) {
      return [];
    }
    
    const fileNames = fs.readdirSync(contentDir);
    
    return fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => {
        return {
          params: {
            slug: fileName.replace(/\.md$/, '')
          }
        };
      });
  } catch (error) {
    console.error('Error getting post slugs:', error);
    return [];
  }
};

// Lấy dữ liệu của một bài viết theo slug
export const getPostBySlug = (slug: string, locale: string = 'vi'): Post | null => {
  try {
    const contentDir = getContentDirectory(locale);
    const fullPath = path.join(contentDir, `${slug}.md`);
    
    // Kiểm tra xem file có tồn tại không
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      slug,
      frontmatter: data as Post['frontmatter'],
      content
    };
  } catch (error) {
    console.error(`Error getting post by slug ${slug}:`, error);
    return null;
  }
};

// Lấy tất cả các bài viết và sắp xếp theo ngày (mới nhất trước)
export const getAllPosts = (locale: string = 'vi'): PostData[] => {
  try {
    const contentDir = getContentDirectory(locale);
    
    // Kiểm tra xem thư mục có tồn tại không
    if (!fs.existsSync(contentDir)) {
      return [];
    }
    
    const fileNames = fs.readdirSync(contentDir);
    
    const allPostsData = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(contentDir, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);
        
        return {
          slug,
          ...data
        } as PostData;
      });
    
    // Lọc bỏ các bài viết có trạng thái draft: true
    const filteredPosts = allPostsData.filter(post => post.draft !== true);
    
    // Sắp xếp bài viết theo ngày, mới nhất trước
    return filteredPosts.sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });
  } catch (error) {
    console.error('Error getting all posts:', error);
    return [];
  }
};

// Lấy các bài viết nổi bật
export const getFeaturedPosts = (locale: string = 'vi', count: number = 3): PostData[] => {
  const allPosts = getAllPosts(locale);
  return allPosts
    .filter(post => post.featured === true)
    .slice(0, count);
};

// Lấy các bài viết liên quan (cùng tag)
export const getRelatedPosts = (currentSlug: string, tags: string[], locale: string = 'vi', count: number = 3): PostData[] => {
  const allPosts = getAllPosts(locale);
  
  return allPosts
    .filter(post => 
      post.slug !== currentSlug && 
      post.tags && 
      post.tags.some((tag: string) => tags.includes(tag))
    )
    .slice(0, count);
};

// Lấy tất cả các tag
export const getAllTags = (locale: string = 'vi'): string[] => {
  const posts = getAllPosts(locale);
  const tags = new Set<string>();
  
  posts.forEach(post => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach((tag: string) => tags.add(tag));
    }
  });
  
  return Array.from(tags);
};

// Lấy tất cả các category
export const getAllCategories = (locale: string = 'vi'): string[] => {
  const posts = getAllPosts(locale);
  const categories = new Set<string>();
  
  posts.forEach(post => {
    if (post.category) {
      categories.add(post.category);
    }
  });
  
  return Array.from(categories);
};

// Lấy tất cả các bài viết theo category
export const getPostsByCategory = (category: string, locale: string = 'vi'): PostData[] => {
  const allPosts = getAllPosts(locale);
  return allPosts.filter(post => post.category === category);
};

// Lấy tất cả các series
export const getAllSeries = (locale: string = 'vi'): { name: string; count: number }[] => {
  const posts = getAllPosts(locale);
  const seriesMap = new Map<string, number>();
  
  posts.forEach(post => {
    if (post.series) {
      const count = seriesMap.get(post.series) || 0;
      seriesMap.set(post.series, count + 1);
    }
  });
  
  return Array.from(seriesMap).map(([name, count]) => ({
    name,
    count,
  }));
};

// Lấy tất cả các bài viết trong một series
export const getPostsBySeries = (seriesName: string, locale: string = 'vi'): PostData[] => {
  const allPosts = getAllPosts(locale);
  return allPosts
    .filter(post => post.series === seriesName)
    .sort((a, b) => (a.seriesPart || 0) - (b.seriesPart || 0));
};

// Lấy bài viết tiếp theo trong series
export const getNextPostInSeries = (currentSlug: string, seriesName: string, locale: string = 'vi'): PostData | null => {
  const seriesPosts = getPostsBySeries(seriesName, locale);
  const currentIndex = seriesPosts.findIndex(post => post.slug === currentSlug);
  
  if (currentIndex !== -1 && currentIndex < seriesPosts.length - 1) {
    return seriesPosts[currentIndex + 1];
  }
  
  return null;
};

// Lấy bài viết trước đó trong series
export const getPreviousPostInSeries = (currentSlug: string, seriesName: string, locale: string = 'vi'): PostData | null => {
  const seriesPosts = getPostsBySeries(seriesName, locale);
  const currentIndex = seriesPosts.findIndex(post => post.slug === currentSlug);
  
  if (currentIndex > 0) {
    return seriesPosts[currentIndex - 1];
  }
  
  return null;
};
