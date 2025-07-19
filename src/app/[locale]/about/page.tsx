import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import AboutHero from '@/components/about/AboutHero';
import AboutBlogSection from '@/components/about/AboutBlogSection';
import ProfileSection from '@/components/about/ProfileSection';
import ExperienceSection from '@/components/about/ExperienceSection';
import ContactCTA from '@/components/about/ContactCTA';
import portfolioData from '@/data/portfolioData.json';

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  // Bật render tĩnh
  setRequestLocale(locale);
  
  const t = await getTranslations('About');
  const commonT = await getTranslations('Common');
  
  // Lấy dữ liệu từ portfolioData.json
  const { personalInfo, profileSummary, keyHighlights } = portfolioData;
  
  return (
    <div className="container mx-auto px-4 py-12">
      <AboutHero 
        title={t('title')}
        
      />
      
      <ProfileSection 
        title={t('profileTitle')}
        personalInfo={personalInfo}
        profileSummary={profileSummary}
      />
      
      <ExperienceSection 
        title={t('experienceTitle')}
        keyHighlights={keyHighlights}
      />
      
      <AboutBlogSection 
        blogTitle={t('blogTitle')}
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

