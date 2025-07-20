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
import YouTubeEmbed from '@/components/blog/YouTubeEmbed'; // Import YouTubeEmbed
import remarkYoutubeShortcode from '@/lib/remark-youtube-shortcode'; // Import the new remark plugin
import { Element } from 'hast';

interface TiptapRendererProps {
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
interface DivProps extends React.HTMLAttributes<HTMLDivElement> {
  node?: Element;
}
// interface HrProps extends React.HTMLAttributes<HTMLHRElement> {
//   node: Element;
// }

// Configure Tiptap extensions for static rendering (for future implementation)
// const extensions = [
//   StarterKit.configure({
//     codeBlock: false, // We'll use the custom CodeBlock extension
//   }),
//   CodeBlock.configure({
//     HTMLAttributes: {
//       class: 'tiptap-code-block',
//     },
//   }),
//   Highlight.configure({
//     multicolor: true,
//   }),
//   TiptapImage.configure({
//     HTMLAttributes: {
//       class: 'tiptap-image',
//     },
//   }),
//   TiptapLink.configure({
//     openOnClick: false,
//     HTMLAttributes: {
//       class: 'tiptap-link',
//     },
//   }),
//   Table.configure({
//     resizable: true,
//     HTMLAttributes: {
//       class: 'tiptap-table',
//     },
//   }),
//   TableRow.configure({
//     HTMLAttributes: {
//       class: 'tiptap-table-row',
//     },
//   }),
//   TableHeader.configure({
//     HTMLAttributes: {
//       class: 'tiptap-table-header',
//     },
//   }),
//   TableCell.configure({
//     HTMLAttributes: {
//       class: 'tiptap-table-cell',
//     },
//   }),
// ];

export default function TiptapRenderer({ content, className = '' }: TiptapRendererProps) {
  // Track copied code blocks
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  // Copy code to clipboard
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Convert markdown to HTML first, then to Tiptap JSON, then render with enhanced components
  const processedContent = React.useMemo(() => {
    try {
      // For now, we'll continue using ReactMarkdown as the primary renderer
      // but with enhanced Tiptap-style components and future migration path
      return content;
    } catch (error) {
      console.error('Error processing content with Tiptap:', error);
      return content;
    }
  }, [content]);

  // Enhanced components with Tiptap-style classes and improved interactions
  const components = {
    // Enhanced headings with better anchor links
    h1: ({ children, ...props }: HeadingProps) => {
      const id = props.id || '';
      return (
        <motion.h1
          className="group relative tiptap-heading tiptap-h1 scroll-mt-24"
          id={id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {children}
          <a 
            href={`#${id}`} 
            className="absolute opacity-0 group-hover:opacity-100 -left-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-all duration-200"
            aria-label="Anchor"
          >
            <span className="text-lg font-bold">#</span>
          </a>
        </motion.h1>
      );
    },
    h2: ({ children, ...props }: HeadingProps) => {
      const id = props.id || '';
      return (
        <motion.h2
          className="group relative tiptap-heading tiptap-h2 scroll-mt-24"
          id={id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {children}
          <a 
            href={`#${id}`} 
            className="absolute opacity-0 group-hover:opacity-100 -left-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-all duration-200"
            aria-label="Anchor"
          >
            <span className="text-lg font-bold">#</span>
          </a>
        </motion.h2>
      );
    },
    h3: ({ children, ...props }: HeadingProps) => {
      const id = props.id || '';
      return (
        <motion.h3
          className="group relative tiptap-heading tiptap-h3 scroll-mt-24"
          id={id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {children}
          <a 
            href={`#${id}`} 
            className="absolute opacity-0 group-hover:opacity-100 -left-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-all duration-200"
            aria-label="Anchor"
          >
            <span className="font-bold">#</span>
          </a>
        </motion.h3>
      );
    },
    
    // Enhanced paragraphs with smooth animations
    p: ({ children }: ParagraphProps) => (
      <motion.p 
        className="text-gray-700 dark:text-gray-300 tiptap-paragraph"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.p>
    ),
    
    // Enhanced blockquotes with better styling
    blockquote: ({ children }: BlockquoteProps) => (
      <motion.blockquote
        className="border-l-4 border-primary pl-6 italic bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-800/50 dark:to-transparent p-6 rounded-r-xl my-6 tiptap-blockquote"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.blockquote>
    ),
    
    // Enhanced lists with better spacing
    ul: ({ children }: ListProps) => (
      <motion.ul
        className="list-disc pl-6 space-y-3 tiptap-list"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.ul>
    ),
    ol: ({ children }: ListProps) => (
      <motion.ol
        className="list-decimal pl-6 space-y-3 tiptap-list"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.ol>
    ),
    li: ({ children }: ListItemProps) => (
      <motion.li 
        className="text-gray-700 dark:text-gray-300 tiptap-list-item"
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.li>
    ),
    
    // Enhanced code blocks with Tiptap styling and improved UX
    code: ({ inline, className, children, ...props }: CodeProps) => {
      const match = /language-(\w+)/.exec(className || '');
      const code = String(children).replace(/\n$/, '');
      
      if (!inline && match) {
        return (
          <motion.div 
            className="relative group my-8 tiptap-code-block-container"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Enhanced language indicator and copy button */}
            <div className="absolute top-3 right-3 z-20 flex items-center gap-3">
              <motion.span 
                className="text-xs font-mono text-gray-400 bg-gray-800/90 dark:bg-gray-900/90 px-3 py-1.5 rounded-md backdrop-blur-sm border border-gray-700/50"
                whileHover={{ scale: 1.05 }}
              >
                {match[1].toUpperCase()}
              </motion.span>
              <motion.button
                onClick={() => copyToClipboard(code)}
                className="flex items-center justify-center h-8 w-8 rounded-md bg-gray-700/80 text-gray-300 hover:bg-gray-600 hover:text-white transition-all duration-200 backdrop-blur-sm border border-gray-600/50"
                aria-label="Copy code"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {copiedCode === code ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-green-400"
                  >
                    <Check className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </motion.button>
            </div>
            
            {/* Enhanced code block with better styling */}
            <div className="rounded-xl bg-[#1e293b] border border-[#334155] shadow-2xl overflow-hidden tiptap-code-block">
              {/* Mac-style window header with enhanced design */}
              <div className="h-10 bg-gradient-to-r from-gray-800/90 to-gray-900/90 dark:from-gray-900/90 dark:to-gray-950/90 flex items-center px-4 border-b border-gray-700/50">
                <div className="flex space-x-2">
                  <motion.div 
                    className="w-3 h-3 rounded-full bg-[#ff5f56]"
                    whileHover={{ scale: 1.2 }}
                  ></motion.div>
                  <motion.div 
                    className="w-3 h-3 rounded-full bg-[#ffbd2e]"
                    whileHover={{ scale: 1.2 }}
                  ></motion.div>
                  <motion.div 
                    className="w-3 h-3 rounded-full bg-[#27c93f]"
                    whileHover={{ scale: 1.2 }}
                  ></motion.div>
                </div>
              </div>
              
              {/* Enhanced scrollable code container */}
              <div className="overflow-x-auto overflow-y-auto max-h-96">
                <code className={`${className} text-base block py-6 px-6 leading-relaxed`} {...props}>
                  {children}
                </code>
              </div>
            </div>
          </motion.div>
        );
      }
      
      return (
        <code 
          className="bg-gray-100 dark:bg-gray-800 px-2.5 py-1.5 rounded-md text-sm font-mono border border-gray-200 dark:border-gray-700 text-rose-600 dark:text-rose-400 tiptap-inline-code"
          {...props}
        >
          {children}
        </code>
      );
    },
    
    // Enhanced links with better hover effects
    a: ({ children, ...props }: AnchorProps) => {
      const href = props.href || '';
      const isExternal = href.startsWith('http');
      
      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-dark inline-flex items-center gap-1.5 border-b border-dashed border-primary hover:border-solid transition-all duration-200 tiptap-link tiptap-external-link"
          >
            {children}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        );
      }
      
      return (
        <Link
          href={href}
          className="text-primary hover:text-primary-dark border-b border-dashed border-primary hover:border-solid transition-all duration-200 tiptap-link tiptap-internal-link"
        >
          {children}
        </Link>
      );
    },
    
    // Enhanced images with better loading and effects
    img: ({ ...props }: ImageComponentProps) => {
      const { src, alt } = props;
      
      return (
        <motion.div 
          className="my-10 overflow-hidden rounded-xl shadow-2xl tiptap-image-container"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="relative aspect-video group"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={src || ''}
              alt={alt || ''}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 768px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
          {alt && (
            <motion.p 
              className="text-sm text-center text-gray-500 dark:text-gray-400 mt-4 px-4 italic tiptap-image-caption"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {alt}
            </motion.p>
          )}
        </motion.div>
      );
    },
    
    // Enhanced tables with better styling and interactions
    table: ({ children }: TableProps) => (
      <div className="overflow-x-auto my-10 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 tiptap-table-container">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 overflow-hidden tiptap-table">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }: TableHeadProps) => (
      <thead className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 tiptap-table-head">
        {children}
      </thead>
    ),
    th: ({ children }: TableHeaderCellProps) => (
      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 dark:text-gray-200 tracking-wider border-b-2 border-gray-300 dark:border-gray-600 uppercase tiptap-table-header">
        {children}
      </th>
    ),
    tbody: ({ children }: TableBodyProps) => (
      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800 tiptap-table-body">
        {children}
      </tbody>
    ),
    tr: ({ children }: TableRowProps) => (
      <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200 tiptap-table-row">
        {children}
      </tr>
    ),
    td: ({ children }: TableCellProps) => (
      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 border-r border-gray-100 dark:border-gray-800 last:border-r-0 tiptap-table-cell">
        {children}
      </td>
    ),
    
    // Enhanced horizontal rule
    hr: () => (
      <hr className="my-12 border-none h-px bg-gradient-to-r from-transparent via-gray-400 dark:via-gray-600 to-transparent tiptap-hr" />
    ),

    // Custom component for YouTube embeds
    div: ({ node, children, className, ...props }: DivProps & { className?: string }) => {
      // Debug logging
      if (className === 'youtube-embed-wrapper' || (node?.properties?.className && Array.isArray(node.properties.className) && node.properties.className.includes('youtube-embed-wrapper'))) {
        console.log('YouTube embed detected!', { className, node, props });
      }

      // Check if this is a YouTube embed div (new approach)
      if (className === 'youtube-embed-wrapper' || (node?.properties?.className && Array.isArray(node.properties.className) && node.properties.className.includes('youtube-embed-wrapper'))) {
        const videoId = props['data-video-id'] || node?.properties?.['data-video-id'] as string;
        const responsive = (props['data-responsive'] || node?.properties?.['data-responsive']) === 'true';
        
        console.log('YouTube embed processing:', { videoId, responsive });
        
        if (!videoId) return null;

        return (
          <motion.div 
            className="my-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <YouTubeEmbed 
              videoId={videoId} 
              width={responsive ? undefined : 560} 
              height={responsive ? undefined : 315} 
              className={responsive ? 'w-full aspect-video' : ''}
              showPreview={true}
            />
          </motion.div>
        );
      }

      // Check if this is a YouTube embed div (old approach)
      if (node?.properties?.['data-youtube-embed'] !== undefined) {
        const videoId = node.properties['data-video-id'] as string;
        const responsive = node.properties['data-responsive'] === 'true';
        
        if (!videoId) return null;

        return (
          <motion.div 
            className="my-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <YouTubeEmbed 
              videoId={videoId} 
              width={responsive ? undefined : 560} 
              height={responsive ? undefined : 315} 
              className={responsive ? 'w-full aspect-video' : ''}
              showPreview={true}
            />
          </motion.div>
        );
      }

      // Regular div handling
      return <div className={className} {...props}>{children}</div>;
    },

    // Custom YouTube embed component
    'youtube-embed': ({ node, ...props }: { node?: Element; [key: string]: any }) => {
      const videoId = props['data-video-id'] || node?.properties?.['data-video-id'];
      const responsive = (props['data-responsive'] || node?.properties?.['data-responsive']) === 'true';
      
      if (!videoId) return null;

      return (
        <motion.div 
          className="my-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <YouTubeEmbed 
            videoId={videoId} 
            width={responsive ? undefined : 560} 
            height={responsive ? undefined : 315} 
            className={responsive ? 'w-full aspect-video' : ''}
            showPreview={true}
          />
        </motion.div>
      );
    },
  };

  // Enhanced Tiptap-style CSS
  const tiptapStyles = `
    .tiptap-renderer {
      font-size: 1.125rem;
      line-height: 1.8;
      color: #374151;
    }
    
    .dark .tiptap-renderer {
      color: #e5e7eb;
    }
    
    /* Enhanced Headings */
    .tiptap-heading {
      font-weight: 700;
      margin-top: 3rem;
      margin-bottom: 1.5rem;
      scroll-margin-top: 100px;
      position: relative;
      color: #1a202c;
      letter-spacing: -0.025em;
    }
    
    .dark .tiptap-heading {
      color: #f3f4f6;
    }
    
    .tiptap-h1 {
      font-size: 2.5rem;
      line-height: 1.2;
      border-bottom: 3px solid #e5e7eb;
      padding-bottom: 1rem;
      background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .dark .tiptap-h1 {
      border-color: #374151;
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .tiptap-h2 {
      font-size: 2rem;
      line-height: 1.3;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid #f3f4f6;
      position: relative;
    }
    
    .dark .tiptap-h2 {
      border-color: #1f2937;
    }
    
    .tiptap-h2::before {
      content: '';
      position: absolute;
      left: -1rem;
      top: 0.75rem;
      width: 0.25rem;
      height: 2rem;
      background: linear-gradient(to bottom, var(--color-primary), var(--color-accent));
      border-radius: 4px;
      opacity: 0.8;
    }
    
    .tiptap-h3 {
      font-size: 1.5rem;
      line-height: 1.4;
      border-bottom: 1px dashed #f3f4f6;
      padding-bottom: 0.5rem;
    }
    
    .dark .tiptap-h3 {
      border-color: #1f2937;
    }
    
    /* Enhanced Paragraphs */
    .tiptap-paragraph {
      margin-bottom: 1.5rem;
      line-height: 1.8;
    }
    
    /* Enhanced Links */
    .tiptap-link {
      position: relative;
      transition: all 0.3s ease;
    }
    
    .tiptap-link:hover {
      transform: translateY(-1px);
    }
    
    /* Enhanced Blockquotes */
    .tiptap-blockquote {
      position: relative;
      overflow: hidden;
    }
    
    .tiptap-blockquote::before {
      content: '"';
      position: absolute;
      top: -0.5rem;
      left: 1rem;
      font-size: 4rem;
      color: var(--color-primary);
      opacity: 0.3;
      font-family: serif;
    }
    
    /* Enhanced Lists */
    .tiptap-list {
      margin-bottom: 1.5rem;
    }
    
    .tiptap-list-item {
      position: relative;
      padding-left: 0.5rem;
    }
    
    /* Enhanced Code */
    .tiptap-inline-code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      font-weight: 500;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .tiptap-code-block {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      position: relative;
    }
    
    .tiptap-code-block-container {
      position: relative;
    }
    
    /* Enhanced Images */
    .tiptap-image-container {
      position: relative;
    }
    
    .tiptap-image-caption {
      background: rgba(0, 0, 0, 0.05);
      dark:background: rgba(255, 255, 255, 0.05);
      padding: 0.75rem;
      border-radius: 0 0 0.75rem 0.75rem;
    }
    
    /* Enhanced Tables */
    .tiptap-table {
      border-collapse: separate;
      border-spacing: 0;
    }
    
    .tiptap-table-container {
      position: relative;
    }
    
    .tiptap-table-header {
      position: relative;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    }
    
    .dark .tiptap-table-header {
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    }
    
    .tiptap-table-row:hover .tiptap-table-cell {
      background-color: rgba(var(--color-primary-rgb), 0.02);
    }
    
    /* Enhanced HR */
    .tiptap-hr {
      position: relative;
      margin: 3rem 0;
    }
    
    .tiptap-hr::before {
      content: '✦';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      color: var(--color-primary);
      padding: 0 1rem;
      font-size: 1.2rem;
    }
    
    .dark .tiptap-hr::before {
      background: #1f2937;
    }
  `;

  return (
    <>
      <style jsx global>{tiptapStyles}</style>
      <div className={`tiptap-renderer prose dark:prose-invert max-w-none 
        prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white 
        prose-p:text-gray-700 dark:prose-p:text-gray-300 
        prose-a:text-primary prose-a:no-underline hover:prose-a:text-primary-dark
        prose-strong:text-gray-800 dark:prose-strong:text-gray-200
        prose-em:text-gray-700 dark:prose-em:text-gray-300
        prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic
        prose-img:rounded-xl prose-img:shadow-lg
        ${className}`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkYoutubeShortcode]}
          rehypePlugins={[
            rehypeRaw, 
            rehypeSlug, 
            [rehypeHighlight, { ignoreMissing: true }]
          ]}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          components={components}
        >
          {processedContent}
        </ReactMarkdown>
      </div>
    </>
  );
}