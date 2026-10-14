import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {load} from 'cheerio';
const origin='https://officialwinbuzz.com';
await fs.mkdir('reference/pages',{recursive:true}); await fs.mkdir('public/assets',{recursive:true});
const previous=JSON.parse(await fs.readFile('reference/inventory.json','utf8').catch(()=>'{}'));
const queue=['/']; const seen=new Set((previous.pages||[]).map(p=>p.route)); const assets=new Map(Object.entries(previous.assets||{})); const pages=previous.pages||[]; const failures=[];
for(const file of (await fs.readdir('reference')).filter(f=>f.endsWith('-sitemap.xml'))){const xml=await fs.readFile('reference/'+file,'utf8');for(const m of xml.matchAll(/<loc>(.*?)<\/loc>/g)){const u=new URL(m[1]);if(u.origin===origin)queue.push(u.pathname.replace(/\/$/,'')||'/');}}
const cssCache=new Map();
async function fetchText(url){const r=await fetch(url);if(!r.ok)throw Error(`${r.status} ${url}`);return r.text()}
async function asset(url){
 if(!url||url.startsWith('data:')||url.startsWith('#'))return url;
 url=new URL(url,origin).href; if(assets.has(url))return assets.get(url);
 const file=crypto.createHash('sha256').update(url).digest('hex').slice(0,16)+path.extname(new URL(url).pathname);
 const local='/assets/'+file; assets.set(url,local);
 try {const r=await fetch(url);if(!r.ok)throw Error(r.status);await fs.writeFile('public'+local,Buffer.from(await r.arrayBuffer()));return local;}catch(e){failures.push({url,error:String(e)});assets.delete(url);return url;}
}
async function cssAssets(css,base){const matches=[...css.matchAll(/url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/g)];for(const m of matches){if(m[1].startsWith('data:'))continue;const local=await asset(new URL(m[1],base).href);css=css.split(m[1]).join(local);}return css;}
while(queue.length){
 const route=queue.shift();if(seen.has(route))continue;seen.add(route);
 console.log('Capture',route);
 let raw;try{raw=route==='/'?await fs.readFile('reference/home.html','utf8'):await fetchText(origin+route);}catch(e){failures.push({url:origin+route,error:String(e)});continue;}
 const $=load(raw);const title=$('title').text(); const description=$('meta[name=description]').attr('content')||'';
 const headings=$('h1,h2,h3,h4').map((i,e)=>({level:Number(e.tagName[1]),text:$(e).text().trim()})).get();
 const links=$('body a[href]').map((i,e)=>({text:$(e).text().trim(),href:$(e).attr('href')})).get();
 for(const {href} of links){try{const u=new URL(href,origin);if(u.origin===origin&&!/\.(png|jpg|webp|svg|xml|css|js|pdf)$/.test(u.pathname)&&!/^\/(wp-|feed|comments)/.test(u.pathname)){const p=u.pathname.replace(/\/$/,'')||'/';if(!seen.has(p)&&!queue.includes(p))queue.push(p);}}catch{}}
 $('script,noscript').remove();
 const styles=[];
 for(const el of $('head link[rel=stylesheet]').toArray()){const url=new URL($(el).attr('href'),origin).href;try{if(!cssCache.has(url))cssCache.set(url,await cssAssets(await fetchText(url),url));styles.push(cssCache.get(url));}catch(e){failures.push({url,error:String(e)});}}
 $('head style').each((i,e)=>styles.push($(e).html()));
 for(const el of $('img,source').toArray()){for(const attr of ['src','data-src']){const value=$(el).attr(attr);if(value)$(el).attr(attr,await asset(value));}$(el).removeAttr('srcset').removeAttr('data-srcset');}
 for(const el of $('[style]').toArray())$(el).attr('style',await cssAssets($(el).attr('style'),origin));
 for(const el of $('body a[href]').toArray()){
  const href=$(el).attr('href');if(href.startsWith('#'))continue;
  try{const u=new URL(href,origin);$(el).attr('href',u.origin===origin?u.pathname+u.search+u.hash:'/out');}catch{$(el).attr('href','/out');}
 }
 $('iframe').each((i,e)=>{if($(e).attr('src')?.includes('cwidget.crictimes.org'))$(e).attr('src','/scores');else $(e).remove();});
 $('form').attr('action','/out').attr('method','get');$('input,textarea').removeAttr('name');
 $('[onclick],[onsubmit],[onload],[onerror]').each((i,e)=>{for(const a of Object.keys(e.attribs))if(a.startsWith('on'))$(e).removeAttr(a);});
 const bodyClass=$('body').attr('class')||'';const body=$('body').html();const slug=route==='/'?'home':route.slice(1).replaceAll('/','__');
 await fs.writeFile(`reference/pages/${slug}.json`,JSON.stringify({route,title,description,bodyClass,body,styles:styles.join('\n')},null,2));
 pages.push({route,title,description,headings,links,forms:$('form').length,images:$('img').map((i,e)=>({alt:$(e).attr('alt'),src:$(e).attr('src')})).get()});
}
await fs.writeFile('reference/inventory.json',JSON.stringify({captured:'2026-10-13',pages,assets:Object.fromEntries(assets),failures},null,2));
console.log(`Captured ${pages.length} pages, ${assets.size} assets, ${failures.length} failures`);
