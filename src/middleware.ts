import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Khớp tất cả các đường dẫn ngoại trừ
  // - ... nếu chúng bắt đầu bằng `/api`, `/trpc`, `/_next` hoặc `/_vercel`
  // - ... những đường dẫn chứa dấu chấm (ví dụ: `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};