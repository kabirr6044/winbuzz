import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {load} from 'cheerio';
import {pageSeo} from '../lib/seo.mjs';
const inventory=JSON.parse(await fs.readFile('reference/inventory.json','utf8'));const routes=new Set(inventory.pages.map(p=>p.route.replace(/\/$/,'')||'/'));const problems=[];let imageCount=0;
for(const p of inventory.pages){const data=JSON.parse(await fs.readFile('reference/pages/'+(p.route==='/'?'home':p.route.slice(1).replaceAll('/','__'))+'.json','utf8'));const $=load(data.body);
 assert.equal($('script,iframe:not([src="/scores"])').length,0,p.route+' includes executable third-party content');
 assert.equal($('input[name],textarea[name]').length,0,p.route+' exposes form values');
 assert.equal($('.replica-widget,[data-score-content]').length,0,p.route+' still contains a score placeholder');
 for(const e of $('a[href]').toArray()){const href=$(e).attr('href');if(!href.startsWith('/')&&!href.startsWith('#'))problems.push(p.route+' external link '+href);if(href.startsWith('/')&&href!='/out'){const u=new URL(href,'http://local');if(!routes.has(u.pathname.replace(/\/$/,'')||'/'))problems.push(p.route+' missing route '+href);}}
 for(const e of $('img[src]').toArray()){const src=$(e).attr('src');imageCount++;if(!src.startsWith('/assets/')&&!src.startsWith('data:'))problems.push(p.route+' remote image '+src);if(src.startsWith('/assets/'))await fs.access('public'+src);}
 for(const m of data.styles.matchAll(/url\(['"]?([^)'"\s]+)/g)){if(!m[1].startsWith('/assets/')&&!m[1].startsWith('data:')&&!m[1].startsWith('#'))problems.push(p.route+' remote CSS asset '+m[1]);}
}
assert.deepEqual([...new Set(problems)],[]);
console.log(`PASS: ${routes.size} routes; ${imageCount} local image references; internal navigation, external links, script removal and form privacy checked.`);
if(process.env.AUDIT_BASE_URL){
 for(const route of [...routes,'/scores']){
  const r=await fetch(process.env.AUDIT_BASE_URL+route);assert.equal(r.status,200,route);
  const $=load(await r.text());
  const expectedTitle=route==='/scores'?'Live Cricket Score Widget - cwidget.crictimes.org':pageSeo(route,inventory.pages.find(p=>(p.route.replace(/\/$/,'')||'/')===route)).title.absolute;
  assert.equal($('title').text(),expectedTitle,route+' browser title');
  assert.equal($('link[rel=icon][sizes="32x32"]').attr('href'),'/assets/favicon.png',route+' 32px favicon');
  assert.equal($('link[rel=icon][sizes="192x192"]').attr('href'),'/assets/favicon.png',route+' 192px favicon');
  assert.equal($('link[rel=apple-touch-icon]').attr('href'),'/assets/favicon.png',route+' Apple icon');
 }
 const icon=await fetch(process.env.AUDIT_BASE_URL+'/assets/favicon.png');assert.equal(icon.status,200);assert.deepEqual(Buffer.from(await icon.arrayBuffer()),await fs.readFile('public/assets/favicon.png'),'Served favicon must match original downloaded file');
 const scores=await fetch(process.env.AUDIT_BASE_URL+'/api/scores');assert.equal(scores.status,200);const data=await scores.json();for(const tab of ['completed','live','upcoming'])assert.ok(Array.isArray(data[tab]),tab+' score data');assert.ok(data.completed.length>0,'Recent score cards must be populated');
 for(const method of ['GET','POST']){const r=await fetch(process.env.AUDIT_BASE_URL+'/out',{method,redirect:'manual'});assert.equal(r.status,303);assert.equal(r.headers.get('location'),process.env.EXTERNAL_REDIRECT_URL||'https://example.com/');}
 const missing=await fetch(process.env.AUDIT_BASE_URL+'/not-a-real-page');assert.equal(missing.status,404);
 console.log('PASS: all HTTP routes, SEO page titles and original favicon, populated score API, GET/POST redirects and 404 response.');
}
