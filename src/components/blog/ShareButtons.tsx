'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ShareNetwork, TwitterLogo, FacebookLogo, LinkedinLogo } from '@/components/icons/PhosphorIcons';

interface ShareButtonsProps {
  url?: string;
  title: string;
  slug?: string;
  className?: string;
}

export default function ShareButtons({ url, title, slug, className = '' }: ShareButtonsProps) {
  const t = useTranslations('BlogPost');
  const [copied, setCopied] = useState(false);
  
  // Get the full URL including the domain
  const fullUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${url || (slug ? `/${slug}` : '')}`
    : url || (slug ? `/${slug}` : '');
  
  const shareLinks = [
    {
      name: 'Twitter',
      icon: <TwitterLogo weight="fill" className="w-5 h-5" />,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`,
      color: 'bg-[#1DA1F2] hover:bg-[#0c85d0]'
    },
    {
      name: 'Facebook',
      icon: <FacebookLogo weight="fill" className="w-5 h-5" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
      color: 'bg-[#4267B2] hover:bg-[#365899]'
    },
    {
      name: 'LinkedIn',
      icon: <LinkedinLogo weight="fill" className="w-5 h-5" />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`,
      color: 'bg-[#0077B5] hover:bg-[#006699]'
    }
  ];
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  return (
    <div className={`${className}`}>
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
        <ShareNetwork weight="fill" className="w-5 h-5 text-primary" />
        {t('share')}
      </h3>
      
      <div className="flex flex-wrap gap-3">
        {shareLinks.map((link) => (
          <motion.a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${link.color} text-white p-2 rounded-full flex items-center justify-center`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Share on ${link.name}`}
          >
            {link.icon}
          </motion.a>
        ))}
        
        <motion.button
          onClick={copyToClipboard}
          className={`${copied ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'} text-white p-2 rounded-full flex items-center justify-center`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Copy link"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.0605 10.4395L8.28033 15.2197C7.98744 15.5126 7.51256 15.5126 7.21967 15.2197C6.92678 14.9268 6.92678 14.452 7.21967 14.1591L11.9998 9.37893L7.21967 4.59877C6.92678 4.30588 6.92678 3.831 7.21967 3.53811C7.51256 3.24522 7.98744 3.24522 8.28033 3.53811L13.0605 8.31827C13.3534 8.61116 13.3534 9.08604 13.0605 9.37893C13.0605 9.37893 13.0605 10.1466 13.0605 9.37893Z" />
            <path d="M16.7803 10.4395L12 15.2197C11.7071 15.5126 11.2322 15.5126 10.9393 15.2197C10.6464 14.9268 10.6464 14.452 10.9393 14.1591L15.7195 9.37893L10.9393 4.59877C10.6464 4.30588 10.6464 3.831 10.9393 3.53811C11.2322 3.24522 11.7071 3.24522 12 3.53811L16.7803 8.31827C17.0732 8.61116 17.0732 9.08604 16.7803 9.37893C16.7803 9.37893 16.7803 10.1466 16.7803 9.37893Z" />
          </svg>
        </motion.button>
      </div>
      
      {copied && (
        <motion.p 
          className="text-sm text-green-600 dark:text-green-400 mt-2"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          Link copied to clipboard!
        </motion.p>
      )}
    </div>
  );
}