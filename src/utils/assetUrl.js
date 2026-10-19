/**
 * Resolves a public asset path against Vite's base URL, ensuring correct URLs
 * both during local development and when deployed to GitHub Pages or subpaths.
 * 
 * @param {string} path - e.g. '/topics/topic-1.jpg' or 'topics/topic-1.jpg'
 * @returns {string} - e.g. '/creative-mindset-portfolio/topics/topic-1.jpg'
 */
export function assetUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const base = (import.meta.env.BASE_URL || '/').endsWith('/')
    ? (import.meta.env.BASE_URL || '/')
    : (import.meta.env.BASE_URL || '/') + '/';
  return `${base}${cleanPath}`;
}
