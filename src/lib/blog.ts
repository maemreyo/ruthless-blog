import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Đường dẫn đến thư mục chứa các bài viết
const getContentDirectory = (locale: string) => {
  return path.join(process.cwd(), 'src', 'content', 'blog', locale);
};

// Lấy tất cả các slug của bài viết
export const getAllPostSlugs = (locale: string = 'vi') => {
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
export const getPostBySlug = (slug: string, locale: string = 'vi') => {
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
      frontmatter: data,
      content
    };
  } catch (error) {
    console.error(`Error getting post by slug ${slug}:`, error);
    return null;
  }
};

// Lấy tất cả các bài viết và sắp xếp theo ngày (mới nhất trước)
export const getAllPosts = (locale: string = 'vi') => {
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
        };
      });
    
    // Sắp xếp bài viết theo ngày, mới nhất trước
    return allPostsData.sort((a, b) => {
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
export const getFeaturedPosts = (locale: string = 'vi', count: number = 3) => {
  const allPosts = getAllPosts(locale);
  return allPosts
    .filter(post => post.featured === true)
    .slice(0, count);
};

// Lấy các bài viết liên quan (cùng tag)
export const getRelatedPosts = (currentSlug: string, tags: string[], locale: string = 'vi', count: number = 3) => {
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
export const getAllTags = (locale: string = 'vi') => {
  const posts = getAllPosts(locale);
  const tags = new Set<string>();
  
  posts.forEach(post => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach((tag: string) => tags.add(tag));
    }
  });
  
  return Array.from(tags);
};