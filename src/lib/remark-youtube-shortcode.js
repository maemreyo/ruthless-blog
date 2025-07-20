import { visit } from 'unist-util-visit';

export default function remarkYoutubeShortcode() {
  return (tree) => {
    visit(tree, 'paragraph', (node) => {
      if (node.children && node.children.length === 1 && node.children[0].type === 'text') {
        const text = node.children[0].value;
        const match = text.match(/^\s*\[video:([a-zA-Z0-9_-]+)(?:\s+(responsive))?\]\s*$/);

        if (match) {
          const videoId = match[1];
          const isResponsive = !!match[2];

          // Convert to HTML node with a more standard approach
          node.type = 'html';
          node.value = `<div class="youtube-embed-wrapper" data-video-id="${videoId}" data-responsive="${isResponsive}"></div>`;
          delete node.children;
        }
      }
    });
  };
}
