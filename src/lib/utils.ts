// Format date
export const formatDate = (dateString: string, locale: string = 'vi') => {
  const date = new Date(dateString);
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  return date.toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', options);
};

// Slugify text (convert to URL-friendly string)
export const slugify = (text: string) => {
  return text
    .toString()
    .normalize('NFD') // Split accented characters into base character and accent
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word characters
    .replace(/--+/g, '-'); // Replace multiple - with single -
};

// Truncate text to a specific length
export const truncateText = (text: string, length: number = 150) => {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
};

// Get reading time estimate
export const getReadingTime = (text: string, locale: string = 'vi') => {
  const wordsPerMinute = 200; // Average reading speed
  const wordCount = text.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  
  return locale === 'vi' 
    ? `${readingTime} phút đọc` 
    : `${readingTime} min read`;
};

// Generate random ID
export const generateId = (length: number = 8) => {
  return Math.random().toString(36).substring(2, 2 + length);
};

// Check if an object is empty
export const isEmptyObject = (obj: Record<string, unknown>) => {
  return Object.keys(obj).length === 0;
};

// Get image dimensions
export const getImageDimensions = (src: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
    };
    img.onerror = reject;
    img.src = src;
  });
};