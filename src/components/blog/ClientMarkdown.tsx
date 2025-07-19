'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { ArrowUpRight, Copy, Check } from '@/components/icons/PhosphorIcons';
import { Element } from 'hast';

interface ClientMarkdownProps {
  content: string;
  className?: string;
}



interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  node: Element;
}
interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  node: Element;
}
interface BlockquoteProps extends React.HTMLAttributes<HTMLQuoteElement> {
  node: Element;
}
interface ListProps extends React.HTMLAttributes<HTMLUListElement | HTMLOListElement> {
  node: Element;
}
interface ListItemProps extends React.HTMLAttributes<HTMLLIElement> {
  node: Element;
}
interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  node?: Element;
  inline?: boolean;
  className?: string;
}
interface AnchorProps extends React.HTMLAttributes<HTMLAnchorElement> {
  node?: Element;
  href?: string;
}
interface ImageComponentProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  node?: Element;
  src?: string;
  alt?: string;
}
interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  node: Element;
}
interface TableHeadProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  node: Element;
}
interface TableHeaderCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  node: Element;
}
interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  node: Element;
}
interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  node: Element;
}
interface TableCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  node: Element;
}
interface HrProps extends React.HTMLAttributes<HTMLHRElement> {
  node: Element;
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
    h1: ({ ...props }: HeadingProps) => {
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
    h2: ({ ...props }: HeadingProps) => {
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
    h3: ({ ...props }: HeadingProps) => {
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
    p: ({ ...props }: ParagraphProps) => (
      <p className="text-gray-700 dark:text-gray-300" {...props} />
    ),
    
    // Enhanced blockquotes (removed animations)
    blockquote: ({ ...props }: BlockquoteProps) => (
      <blockquote
        className="border-l-4 border-primary pl-4 italic bg-gray-50 dark:bg-gray-800/50 p-4 rounded-r-lg"
        {...props}
      />
    ),
    
    // Lists (removed animations)
    ul: ({ ...props }: ListProps) => (
      <ul
        className="list-disc pl-6 space-y-2"
        {...props}
      />
    ),
    ol: ({ ...props }: ListProps) => (
      <ol
        className="list-decimal pl-6 space-y-2"
        {...props}
      />
    ),
    li: ({ ...props }: ListItemProps) => (
      <li className="text-gray-700 dark:text-gray-300" {...props} />
    ),
    
    // Enhanced code blocks with syntax highlighting and copy button
    code: ({ inline, className, children, ...props }: CodeProps) => {
      const match = /language-(\w+)/.exec(className || '');
      const code = String(children).replace(/\n$/, '');
      
      if (!inline && match) {
        return (
          <div className="relative group my-8">
            {/* Language indicator and copy button */}
            <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
              <span className="text-xs font-mono text-gray-400 bg-gray-800/80 dark:bg-gray-900/80 px-2 py-1 rounded">{match[1]}</span>
              <button
                onClick={() => copyToClipboard(code)}
                className="flex items-center justify-center h-7 w-7 rounded bg-gray-700/80 text-gray-300 hover:bg-gray-600 transition-colors"
                aria-label="Copy code"
              >
                {copiedCode === code ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            
            {/* Code block with proper scrolling */}
            <pre className="rounded-lg bg-[#1e293b] border border-[#334155] shadow-lg overflow-hidden">
              {/* Mac-style window dots */}
              <div className="h-9 bg-gray-800/90 dark:bg-gray-900/90 flex items-center px-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                </div>
              </div>
              
              {/* Scrollable code container */}
              <div className="overflow-x-auto">
                <code className={`${className} text-base block py-4 px-4`} {...props}>
                  {children}
                </code>
              </div>
            </pre>
          </div>
        );
      }
      
      return (
        <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono border border-gray-200 dark:border-gray-700 text-rose-600 dark:text-rose-400" {...props}>
          {children}
        </code>
      );
    },
    
    // Enhanced links
    a: ({ ...props }: AnchorProps) => {
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
    img: ({ ...props }: ImageComponentProps) => {
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
              src={src || ''}
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
    table: ({ ...props }: TableProps) => (
      <div className="overflow-x-auto my-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 overflow-hidden" {...props} />
      </div>
    ),
    thead: ({ ...props }: TableHeadProps) => (
      <thead className="bg-gray-100 dark:bg-gray-800" {...props} />
    ),
    th: ({ ...props }: TableHeaderCellProps) => (
      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 tracking-wider border-b-2 border-gray-300 dark:border-gray-600" {...props} />
    ),
    tbody: ({ ...props }: TableBodyProps) => (
      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800" {...props} />
    ),
    tr: ({ ...props }: TableRowProps) => (
      <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors" {...props} />
    ),
    td: ({ ...props }: TableCellProps) => (
      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 border-r border-gray-100 dark:border-gray-800 last:border-r-0" {...props} />
    ),
    
    // Horizontal rule
    hr: ({ ...props }: HrProps) => (
      <hr className="my-8 border-none h-px bg-gradient-to-r from-transparent via-gray-400 dark:via-gray-600 to-transparent" {...props} />
    ),
  };

  return (
    <div className={`markdown-content prose dark:prose-invert max-w-none 
      prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white 
      prose-p:text-gray-700 dark:prose-p:text-gray-300 
      prose-a:text-primary prose-a:no-underline hover:prose-a:text-primary-dark
      prose-strong:text-gray-800 dark:prose-strong:text-gray-200
      prose-em:text-gray-700 dark:prose-em:text-gray-300
      prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic
      prose-img:rounded-xl prose-img:shadow-lg
      ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSlug, [rehypeHighlight, { ignoreMissing: true }]]}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        components={components}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}

