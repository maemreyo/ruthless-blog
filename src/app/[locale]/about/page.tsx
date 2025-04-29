import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { EnvelopeSimple, GithubLogo, TwitterLogo, LinkedinLogo } from '@/components/icons/PhosphorIcons';

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  // Bật render tĩnh
  setRequestLocale(locale);
  
  const t = await getTranslations('About');
  const commonT = await getTranslations('Common');
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const technologies = [
    { name: 'Next.js', description: 'React framework for production' },
    { name: 'TypeScript', description: 'Typed JavaScript at scale' },
    { name: 'Tailwind CSS', description: 'Utility-first CSS framework' },
    { name: 'Framer Motion', description: 'Animation library for React' },
    { name: 'next-intl', description: 'Internationalization for Next.js' },
    { name: 'MDX', description: 'Markdown for the component era' },
    { name: 'Vercel', description: 'Platform for frontend frameworks' }
  ];
  
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <motion.div 
        className="mb-16 relative"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white"
          variants={fadeInUp}
        >
          {t('title')}
        </motion.h1>
        
        <motion.div 
          className="bg-gradient-to-r from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 rounded-xl p-8 relative overflow-hidden"
          variants={fadeInUp}
        >
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-elegant">
                <Image 
                  src="/images/author.jpg" 
                  alt="Author" 
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            
            <div className="w-full md:w-2/3">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                {t('authorTitle')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Hello! I'm Matthew, a passionate developer and writer. I created this blog to share my knowledge and experiences in the world of technology, programming, and personal growth.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                With over 5 years of experience in web development, I specialize in creating modern, accessible, and performant web applications using the latest technologies.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <a 
                  href="https://github.com/wehttam" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                >
                  <GithubLogo weight="fill" className="w-5 h-5" />
                  <span>GitHub</span>
                </a>
                <a 
                  href="https://twitter.com/wehttam" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                >
                  <TwitterLogo weight="fill" className="w-5 h-5" />
                  <span>Twitter</span>
                </a>
                <a 
                  href="https://linkedin.com/in/wehttam" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                >
                  <LinkedinLogo weight="fill" className="w-5 h-5" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/5 rounded-full -ml-5 -mb-5"></div>
        </motion.div>
      </motion.div>
      
      {/* About Blog Section */}
      <motion.section 
        className="mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <motion.h2 
          className="text-2xl font-bold mb-8 text-gray-900 dark:text-white"
          variants={fadeInUp}
        >
          <span className="inline-block border-b-4 border-primary pb-2">{t('blogTitle')}</span>
        </motion.h2>
        
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-elegant p-8"
          variants={fadeInUp}
        >
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Wehttam Blog is a platform where I share my thoughts, tutorials, and insights on web development, programming best practices, and technology trends. The blog is designed to be a resource for developers of all skill levels, from beginners to experts.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            My goal is to create content that is not only informative but also engaging and accessible. I believe in the power of knowledge sharing and community building in the tech industry.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Whether you're looking to learn a new technology, improve your coding skills, or stay updated with the latest trends, I hope you'll find something valuable here.
          </p>
        </motion.div>
      </motion.section>
      
      {/* Technologies Section */}
      <motion.section 
        className="mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <motion.h2 
          className="text-2xl font-bold mb-8 text-gray-900 dark:text-white"
          variants={fadeInUp}
        >
          <span className="inline-block border-b-4 border-primary pb-2">{t('techTitle')}</span>
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technologies.map((tech, index) => (
            <motion.div 
              key={tech.name}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-elegant p-6 hover:shadow-float transition-all duration-300"
              variants={fadeInUp}
              whileHover={{ y: -5 }}
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{tech.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">{tech.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
      
      {/* Contact CTA */}
      <motion.section 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{t('contactMe')}</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Have a question, suggestion, or just want to say hello? I'd love to hear from you! Feel free to reach out through the contact form or connect with me on social media.
        </p>
        <Link 
          href="/contact" 
          className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white font-medium text-lg rounded-lg shadow-elegant hover:bg-primary-dark hover:shadow-float transition-all duration-300"
        >
          <EnvelopeSimple weight="fill" className="w-5 h-5" />
          {commonT('learnMore')}
        </Link>
      </motion.section>
    </div>
  );
}

// Generate static params for the page
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'vi' }];
}