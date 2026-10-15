import assert from 'node:assert/strict';
import {load} from 'cheerio';
import {pages, pageSeo, isIndexable, siteUrl} from '../lib/seo.mjs';

const base = process.env.AUDIT_BASE_URL;
assert.ok(base, 'Set AUDIT_BASE_URL to the production server to verify.');
const titles = new Set();
const descriptions = new Set();
let checked = 0;
const queue = [...pages];
await Promise.all(Array.from({length: 6}, async () => {
  while (queue.length) {
    const page = queue.shift();
    const response = await fetch(base + page.route);
    assert.equal(response.status, 200, page.route);
    const dom = load(await response.text());
    const expected = pageSeo(page.route, page);
    const title = dom('title').text();
    const description = dom('meta[name="description"]').attr('content');
    assert.equal(title, expected.title.absolute, `${page.route} title`);
    assert.equal(description, expected.description, `${page.route} description`);
    assert.ok(!titles.has(title), `${page.route} duplicate title`);
    assert.ok(!descriptions.has(description), `${page.route} duplicate description`);
    titles.add(title); descriptions.add(description);
    assert.equal(dom('link[rel="canonical"]').length, 1, `${page.route} canonical count`);
    assert.equal(dom('link[rel="canonical"]').attr('href'), expected.alternates.canonical);
    const robots = dom('meta[name="robots"]').attr('content');
    assert.equal(robots, isIndexable(page.route) ? 'index, follow' : 'noindex, follow', page.route);
    assert.equal(dom('h1').length, 1, `${page.route} server-rendered H1`);
    assert.equal(dom('h1').text().replace(/\s+/g, ' ').trim(), page.headings.find(h=>h.level===1).text.replace(/\s+/g, ' ').trim(), `${page.route} visible heading unchanged`);
    checked++;
  }
}));

const sitemap = await fetch(base + '/sitemap.xml');
assert.equal(sitemap.status, 200);
assert.match(sitemap.headers.get('content-type'), /xml/);
const xml = load(await sitemap.text(), {xmlMode: true});
const urls = xml('loc').map((_,e)=>xml(e).text()).get();
assert.deepEqual(urls.sort(), pages.filter(p=>isIndexable(p.route)).map(p=>new URL(p.route,siteUrl()).href).sort());
const robotsResponse = await fetch(base + '/robots.txt');
assert.equal(robotsResponse.status, 200);
const robotsText = await robotsResponse.text();
assert.match(robotsText, /User-Agent: \*/i);
assert.ok(robotsText.includes(`Sitemap: ${siteUrl()}/sitemap.xml`));
assert.ok(!robotsText.includes('Disallow: /'), 'Do not block pages that need noindex discovery.');
for (const route of ['/scores','/specification.html','/api/health','/out']) {
  const response = await fetch(base + route, {redirect:'manual'});
  assert.equal(response.headers.get('x-robots-tag'), 'noindex, follow', route);
  assert.equal(response.status, route==='/out'?303:200, route);
}
const missing = await fetch(base + '/not-a-real-seo-page');
assert.equal(missing.status,404);
assert.match(await missing.text(), /noindex/);
const bot = await fetch(base + '/login', {headers:{'user-agent':'Googlebot'}});
const botDom = load(await bot.text());
assert.equal(botDom('head link[rel="canonical"]').attr('href'), `${siteUrl()}/login`);
assert.equal(botDom('head meta[name="robots"]').attr('content'), 'index, follow');
console.log(`PASS: ${checked} server-rendered routes, unique metadata, unchanged H1s, ${urls.length} sitemap URLs, canonicals, robots.txt, utility exclusions, Googlebot head metadata and 404s. Canonical origin=${siteUrl()}`);
