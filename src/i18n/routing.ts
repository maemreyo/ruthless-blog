import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // Danh sách các ngôn ngữ được hỗ trợ
  locales: ['en', 'vi'],

  // Ngôn ngữ mặc định khi không có ngôn ngữ nào khớp
  defaultLocale: 'vi'
});