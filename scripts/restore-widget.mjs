import fs from 'node:fs/promises';
import {load} from 'cheerio';
const raw=load(await fs.readFile('reference/home.html','utf8'));
const iframe=raw('iframe[title="Live cricket scores — Recent, Live, Upcoming"]').clone().attr('src','/scores');
const file='reference/pages/home.json';const data=JSON.parse(await fs.readFile(file,'utf8'));const $=load(data.body);
if($('.replica-widget').length){$('.replica-widget').replaceWith(raw.html(iframe));data.body=$('body').html();await fs.writeFile(file,JSON.stringify(data,null,2));}
console.log('Home uses the locally rendered original cricket widget');
