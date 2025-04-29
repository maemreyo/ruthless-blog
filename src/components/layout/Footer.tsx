import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function Footer() {
  const t = useTranslations('Footer');
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600">
              {t('copyright', { year: currentYear })}
            </p>
          </div>
          
          <div className="flex space-x-4">
            <Link href="/" className="text-gray-600 hover:text-blue-500">
              Home
            </Link>
            <Link href="/blog" className="text-gray-600 hover:text-blue-500">
              Blog
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-500">
              About
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-blue-500">
              Contact
            </Link>
          </div>
        </div>
        
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>{t('poweredBy')}</p>
        </div>
      </div>
    </footer>
  );
}