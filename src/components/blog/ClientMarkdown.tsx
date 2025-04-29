'use client';

import ReactMarkdown from 'react-markdown';

interface ClientMarkdownProps {
  children: string;
  className?: string;
}

export default function ClientMarkdown({ children, className }: ClientMarkdownProps) {
  return (
    <ReactMarkdown className={className}>
      {children}
    </ReactMarkdown>
  );
}