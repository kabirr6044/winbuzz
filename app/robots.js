import {siteUrl} from '../lib/seo.mjs';

export const dynamic = 'force-dynamic';

export default function robots() {
  return {
    rules: {userAgent: '*', allow: '/'},
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
