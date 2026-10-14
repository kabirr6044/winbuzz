import {notFound} from 'next/navigation';
import {getPage} from '../../lib/pages';
import Replica from '../replica';
export async function generateMetadata({params}){const {slug=[]}=await params;const page=await getPage('/'+slug.join('/'));return {title:page?{absolute:page.title}:undefined,description:page?.description};}
export default async function Page({params}){const {slug=[]}=await params;const page=await getPage('/'+slug.join('/'));if(!page)notFound();return <><style dangerouslySetInnerHTML={{__html:page.styles}}/><link rel="stylesheet" href="/utilities.css"/><Replica page={page}/></>}
