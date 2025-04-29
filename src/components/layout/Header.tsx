'use client';

import { useTranslations } from 'next-intl';
import EnhancedNavigation from './EnhancedNavigation';

export default function Header() {
  const t = useTranslations('Navigation');
  
  return (
    <EnhancedNavigation
      homeText={t('home')}
      blogText={t('blog')}
      aboutText={t('about')}
      contactText={t('contact')}
    />
  );
}