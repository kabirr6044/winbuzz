import {notFound} from 'next/navigation';
import {getPage} from '../../lib/pages';
import Replica from '../replica';
import {pageSeo} from '../../lib/seo.mjs';
export async function generateMetadata({params}){const {slug=[]}=await params;const route='/'+slug.join('/');const page=await getPage(route);if(!page)return {robots:{index:false,follow:true}};return pageSeo(route,page);}
export default async function Page({params}){const {slug=[]}=await params;const page=await getPage('/'+slug.join('/'));if(!page)notFound();return <><style dangerouslySetInnerHTML={{__html:page.styles}}/><link rel="stylesheet" href="/utilities.css"/><Replica page={page}/></>}
