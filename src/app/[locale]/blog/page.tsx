import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

export default function BlogPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  
  // Bật render tĩnh
  setRequestLocale(locale);
  
  const t = useTranslations('Blog');
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>
      <p>Blog posts will be displayed here</p>
    </div>
  );
}