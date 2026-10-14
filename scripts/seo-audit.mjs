import fs from 'node:fs/promises';
import {load} from 'cheerio';
import {createHash} from 'node:crypto';

const inventory=JSON.parse(await fs.readFile('reference/inventory.json','utf8')).pages;
const rows=[];
for(const page of inventory){
 const data=JSON.parse(await fs.readFile('reference/pages/'+(page.route==='/'?'home':page.route.slice(1).replaceAll('/','__'))+'.json','utf8'));
 const dom=load(data.body);
 const text=dom('main').text().replace(/\s+/g,' ').trim()||dom('body').text().replace(/\s+/g,' ').trim();
 rows.push({route:page.route,title:page.title,description:page.description,h1:dom('h1').map((_,e)=>dom(e).text().trim()).get(),wordCount:text.split(/\s+/).length,mainHash:createHash('sha256').update(text).digest('hex'),images:dom('img').length,imagesWithoutAlt:dom('img:not([alt]),img[alt=""]').length,imagesWithoutDimensions:dom('img:not([width]),img:not([height])').length,linksToOut:dom('a[href="/out"]').length,structuredData:dom('script[type="application/ld+json"]').length,canonicalInBody:dom('link[rel="canonical"]').length});
}
const group=(key)=>Object.values(rows.reduce((acc,row)=>{(acc[row[key]]??=[]).push(row.route);return acc},{})).filter(routes=>routes.length>1);
const report={date:'2026-10-15',scope:'Repository snapshot plus HTTP checks when a base URL is supplied. No field Core Web Vitals, Search Console, or keyword-volume data.',pageCount:rows.length,missingDescriptions:rows.filter(r=>!r.description).length,h1Problems:rows.filter(r=>r.h1.length!==1).map(r=>({route:r.route,count:r.h1.length})),duplicateTitles:group('title'),identicalMainText:group('mainHash'),rows,http:[]};
const base=process.env.SEO_BASE_URL;
if(base){
 for(const route of ['/','/login','/blog','/blog/page/2','/tag/winbuzz-login','/winbuzz-login-troubleshooting','/robots.txt','/sitemap.xml','/not-a-real-seo-page','/out']){
  try{
   const start=Date.now();const response=await fetch(base+route,{redirect:'manual',signal:AbortSignal.timeout(90000)});
   const html=await response.text();const dom=load(html);
   report.http.push({route,status:response.status,elapsedMs:Date.now()-start,contentType:response.headers.get('content-type'),location:response.headers.get('location'),xRobotsTag:response.headers.get('x-robots-tag'),robots:dom('meta[name="robots"]').map((_,e)=>dom(e).attr('content')).get(),title:dom('title').text(),description:dom('meta[name="description"]').attr('content'),canonical:dom('link[rel="canonical"]').attr('href'),h1:dom('h1').map((_,e)=>dom(e).text()).get(),bodyBytes:Buffer.byteLength(html),structuredData:dom('script[type="application/ld+json"]').length,ogTitle:dom('meta[property="og:title"]').attr('content'),htmlHasContent:dom('h1').length>0});
  }catch(error){report.http.push({route,error:error.message})}
 }
}
await fs.mkdir('docs/seo',{recursive:true});
await fs.writeFile('docs/seo/technical-audit.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({pageCount:report.pageCount,missingDescriptions:report.missingDescriptions,h1Problems:report.h1Problems,duplicateTitleGroups:report.duplicateTitles.length,identicalMainTextGroups:report.identicalMainText.length,identicalMainText:report.identicalMainText,http:report.http},null,2));
