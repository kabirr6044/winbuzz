import {pages, isIndexable, siteUrl} from '../lib/seo.mjs';

// Resolve the production origin at runtime, including Docker deployments.
export const dynamic = 'force-dynamic';

export default function sitemap() {
  return pages.filter(page => isIndexable(page.route)).map(page => ({
    url: new URL(page.route, siteUrl()).href,
  }));
}
