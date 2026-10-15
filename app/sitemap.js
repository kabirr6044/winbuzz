import {pages, isIndexable, siteUrl} from '../lib/seo.mjs';

// Canonicals and sitemap URLs share the origin defined in lib/seo.mjs.
export const dynamic = 'force-dynamic';

export default function sitemap() {
  return pages.filter(page => isIndexable(page.route)).map(page => ({
    url: new URL(page.route, siteUrl()).href,
  }));
}
