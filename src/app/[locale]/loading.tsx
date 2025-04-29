import { useTranslations } from 'next-intl';

export default function Loading() {
  const t = useTranslations('Common');
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-lg">{t('loading')}</p>
      </div>
    </div>
  );
}