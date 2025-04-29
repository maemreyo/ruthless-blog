'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('Error');
  
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);
  
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
      <p className="text-lg mb-8">{t('description')}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-4"
      >
        {t('tryAgain')}
      </button>
    </div>
  );
}