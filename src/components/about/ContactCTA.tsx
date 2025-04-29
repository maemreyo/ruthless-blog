'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { EnvelopeSimple } from '@/components/icons/PhosphorIcons';

interface ContactCTAProps {
  contactMeTitle: string;
  learnMoreText: string;
}

export default function ContactCTA({ contactMeTitle, learnMoreText }: ContactCTAProps) {
  const t = useTranslations('About');
  return (
    <motion.section 
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{contactMeTitle}</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
        {t('contactDescription')}
      </p>
      <Link 
        href="/contact" 
        className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white font-medium text-lg rounded-lg shadow-elegant hover:bg-primary-dark hover:shadow-float transition-all duration-300"
      >
        <EnvelopeSimple weight="fill" className="w-5 h-5" />
        {learnMoreText}
      </Link>
    </motion.section>
  );
}