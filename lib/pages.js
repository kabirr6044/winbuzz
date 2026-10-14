import fs from 'node:fs/promises';
import path from 'node:path';
export async function getPage(route){const slug=route==='/'?'home':route.slice(1).replaceAll('/','__');try{return JSON.parse(await fs.readFile(path.join(process.cwd(),'reference/pages',slug+'.json'),'utf8'));}catch{return null;}}
