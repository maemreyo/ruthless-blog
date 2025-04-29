import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// Các wrapper nhẹ xung quanh API điều hướng của Next.js
// có tính đến cấu hình định tuyến
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);