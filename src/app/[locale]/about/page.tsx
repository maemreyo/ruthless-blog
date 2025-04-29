import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

export default function AboutPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  
  // Bật render tĩnh
  setRequestLocale(locale);
  
  const t = useTranslations('About');
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">{t('authorTitle')}</h2>
        <p className="mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, 
          nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl 
          nisl sit amet nisl.
        </p>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">{t('blogTitle')}</h2>
        <p className="mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod,
          nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl
          nisl sit amet nisl.
        </p>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold mb-4">{t('techTitle')}</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Next.js (App Router)</li>
          <li>Tailwind CSS</li>
          <li>Framer Motion</li>
          <li>Decap CMS</li>
          <li>next-intl</li>
        </ul>
      </section>
    </div>
  );
}