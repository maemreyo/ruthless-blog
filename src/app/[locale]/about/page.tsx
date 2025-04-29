import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import AboutHero from '@/components/about/AboutHero';
import AboutBlogSection from '@/components/about/AboutBlogSection';
import TechnologiesSection from '@/components/about/TechnologiesSection';
import ContactCTA from '@/components/about/ContactCTA';

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  // Bật render tĩnh
  setRequestLocale(locale);
  
  const t = await getTranslations('About');
  const commonT = await getTranslations('Common');
  
  // Định nghĩa các công nghệ được sử dụng
  const technologies = [
    { name: 'Next.js', description: t('nextjsDescription') },
    { name: 'TypeScript', description: t('typescriptDescription') },
    { name: 'Tailwind CSS', description: t('tailwindDescription') },
    { name: 'Framer Motion', description: t('framerDescription') },
    { name: 'next-intl', description: t('nextIntlDescription') },
    { name: 'MDX', description: t('mdxDescription') },
    { name: 'Vercel', description: t('vercelDescription') }
  ];
  
  return (
    <div className="container mx-auto px-4 py-12">
      <AboutHero 
        title={t('title')}
        authorTitle={t('authorTitle')}
      />
      
      <AboutBlogSection 
        blogTitle={t('blogTitle')}
      />
      
      <TechnologiesSection 
        techTitle={t('techTitle')}
        technologies={technologies}
      />
      
      <ContactCTA 
        contactMeTitle={t('contactMe')}
        learnMoreText={commonT('learnMore')}
      />
    </div>
  );
}

// Generate static params for the page
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'vi' }];
}

