import fs from 'node:fs/promises';
import {load} from 'cheerio';
const inventory=JSON.parse(await fs.readFile('reference/inventory.json','utf8'));
inventory.pages=inventory.pages.filter((p,i,a)=>i===a.findIndex(q=>q.route.replace(/\/$/,'')===p.route.replace(/\/$/,'')));
for(const p of inventory.pages){
 const file='reference/pages/'+(p.route==='/'?'home':p.route.slice(1).replaceAll('/','__'))+'.json';const data=JSON.parse(await fs.readFile(file,'utf8'));
 const $=load(data.body);const main=$('main').length?$('main'):$('body');
 p.sections=main.find('h1,h2,h3,h4').map((i,e)=>({level:Number(e.tagName[1]),text:$(e).text().trim()})).get();
 p.blocks=main.children('section').map((i,e)=>({id:$(e).attr('id')||'',heading:$(e).find('h1,h2,h3').first().text().trim()})).get();
 p.fields=$('input,textarea,select').map((i,e)=>({label:$(e).attr('placeholder')||$(e).attr('id')||e.tagName,type:$(e).attr('type')||e.tagName})).get();
 // These three legacy CSS URLs return 404 on the original site and are not used by its current content.
 data.styles=data.styles.replace(/url\([^)]*(?:hero-banner|banner-1|banner-2)\.jpg[^)]*\)/g,'none');
 $('form a').has('button[type=submit]').each((i,e)=>$(e).replaceWith($(e).html()));
 $('a[target=_blank]').attr('rel','noopener noreferrer');
 $('a[href^="/"]').each((i,e)=>{const u=new URL($(e).attr('href'),'http://local');$(e).attr('href',(u.pathname.replace(/\/+$/,'')||'/')+u.search+u.hash);});
 $('.swiper-button-next,.swiper-button-prev').each((i,e)=>{const next=$(e).hasClass('swiper-button-next');$(e).replaceWith(`<button type="button" class="${$(e).attr('class')}" aria-label="${next?'Next':'Previous'} review">${$(e).html()}</button>`);});
 $('button.navigation-toggler').attr('aria-expanded','false').attr('aria-controls','navbar-main');$('nav').first().attr('id','navbar-main');
 data.body=$('body').html();await fs.writeFile(file,JSON.stringify(data,null,2));
}
await fs.writeFile('reference/inventory.json',JSON.stringify(inventory,null,2));
console.log('Finalized',inventory.pages.length,'routes');
