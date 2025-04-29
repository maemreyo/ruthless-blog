'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export default function LanguageSwitcher() {
  const t = useTranslations('Navigation');
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  const changeLocale = (locale: string) => {
    router.replace(pathname, { locale });
    setIsOpen(false);
  };
  
  const localeNames: Record<string, string> = {
    en: t('english'),
    vi: t('vietnamese')
  };
  
  return (
    <div className="relative">
      <button
        className="flex items-center space-x-1 text-gray-700 hover:text-blue-500"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>{t('language')}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
          <ul className="py-1">
            {routing.locales.map((locale) => (
              <li key={locale}>
                <button
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => changeLocale(locale)}
                >
                  {localeNames[locale]}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}