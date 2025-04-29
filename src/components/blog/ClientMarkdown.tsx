'use client';

import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { ArrowUpRight, ArrowRight, Copy, Check } from '@/components/icons/PhosphorIcons';

interface ClientMarkdownProps {
  content: string;
  className?: string;
}

export default function ClientMarkdown({ content, className = '' }: ClientMarkdownProps) {
  // Track copied code blocks
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  // Process content to add IDs to headings
  const processedContent = React.useMemo(() => {
    return content;
  }, [content]);

  // Copy code to clipboard
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Custom components for ReactMarkdown
  const components = {
    // Headings with anchor links (removed animations to prevent re-rendering issues)
    h1: ({ node, ...props }: any) => {
      const id = props.id || '';
      return (
        <h1
          className="group relative"
          {...props}
          id={id}
        >
          {props.children}
          <a 
            href={`#${id}`} 
            className="absolute opacity-0 group-hover:opacity-100 -left-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-opacity"
            aria-label="Anchor"
          >
            #
          </a>
        </h1>
      );
    },
    h2: ({ node, ...props }: any) => {
      const id = props.id || '';
      return (
        <h2
          className="group relative"
          {...props}
          id={id}
        >
          {props.children}
          <a 
            href={`#${id}`} 
            className="absolute opacity-0 group-hover:opacity-100 -left-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-opacity"
            aria-label="Anchor"
          >
            #
          </a>
        </h2>
      );
    },
    h3: ({ node, ...props }: any) => {
      const id = props.id || '';
      return (
        <h3
          className="group relative"
          {...props}
          id={id}
        >
          {props.children}
          <a 
            href={`#${id}`} 
            className="absolute opacity-0 group-hover:opacity-100 -left-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-opacity"
            aria-label="Anchor"
          >
            #
          </a>
        </h3>
      );
    },
    
    // Paragraphs (removed animations)
    p: ({ node, ...props }: any) => (
      <p {...props} />
    ),
    
    // Enhanced blockquotes (removed animations)
    blockquote: ({ node, ...props }: any) => (
      <blockquote
        className="border-l-4 border-primary pl-4 italic bg-gray-50 dark:bg-gray-800/50 p-4 rounded-r-lg"
        {...props}
      />
    ),
    
    // Lists (removed animations)
    ul: ({ node, ...props }: any) => (
      <ul
        className="list-disc pl-6 space-y-2"
        {...props}
      />
    ),
    ol: ({ node, ...props }: any) => (
      <ol
        className="list-decimal pl-6 space-y-2"
        {...props}
      />
    ),
    li: ({ node, ...props }: any) => (
      <li {...props} />
    ),
    
    // Enhanced code blocks with syntax highlighting and copy button
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '');
      const code = String(children).replace(/\n$/, '');
      
      if (!inline && match) {
        return (
          <div className="relative group">
            <pre className={`${className} rounded-lg overflow-hidden`} {...props}>
              <code className={className} {...props}>
                {children}
              </code>
            </pre>
            <button
              onClick={() => copyToClipboard(code)}
              className="absolute top-2 right-2 p-2 rounded-md bg-gray-700/50 text-gray-300 hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Copy code"
            >
              {copiedCode === code ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>
        );
      }
      
      return (
        <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      );
    },
    
    // Enhanced links
    a: ({ node, ...props }: any) => {
      const href = props.href || '';
      const isExternal = href.startsWith('http');
      
      if (isExternal) {
        return (
          <a
            {...props}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-dark inline-flex items-center gap-1 border-b border-dashed border-primary hover:border-solid transition-all"
          >
            {props.children}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        );
      }
      
      return (
        <Link
          href={href}
          className="text-primary hover:text-primary-dark border-b border-dashed border-primary hover:border-solid transition-all"
        >
          {props.children}
        </Link>
      );
    },
    
    // Enhanced images with Next.js Image component
    img: ({ node, ...props }: any) => {
      const { src, alt } = props;
      
      return (
        <div className="my-8 overflow-hidden rounded-lg shadow-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative aspect-video"
          >
            <Image
              src={src}
              alt={alt || ''}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </motion.div>
          {alt && (
            <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-2 italic">
              {alt}
            </p>
          )}
        </div>
      );
    },
    
    // Enhanced tables
    table: ({ node, ...props }: any) => (
      <div className="overflow-x-auto my-8">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden" {...props} />
      </div>
    ),
    thead: ({ node, ...props }: any) => (
      <thead className="bg-gray-50 dark:bg-gray-800" {...props} />
    ),
    th: ({ node, ...props }: any) => (
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" {...props} />
    ),
    tbody: ({ node, ...props }: any) => (
      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800" {...props} />
    ),
    tr: ({ node, ...props }: any) => (
      <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors" {...props} />
    ),
    td: ({ node, ...props }: any) => (
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400" {...props} />
    ),
    
    // Horizontal rule
    hr: ({ node, ...props }: any) => (
      <hr className="my-8 border-none h-px bg-gradient-to-r from-transparent via-gray-400 dark:via-gray-600 to-transparent" {...props} />
    ),
  };

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSlug, [rehypeHighlight, { ignoreMissing: true }]]}
        components={components}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}

