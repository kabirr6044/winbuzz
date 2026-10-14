import {NextResponse} from 'next/server';
import snapshot from '../../../reference/scores.json';
export async function GET(){
 try{
  const response=await fetch('https://crictimes.org/data/v1/scores.json',{next:{revalidate:30},signal:AbortSignal.timeout(5000)});
  if(!response.ok)throw Error('Score provider unavailable');
  const data=await response.json();
  if(!['completed','live','upcoming'].every(key=>Array.isArray(data[key])))throw Error('Invalid score data');
  return NextResponse.json(data,{headers:{'Cache-Control':'public, max-age=30'}});
 }catch{return NextResponse.json(snapshot,{headers:{'Cache-Control':'public, max-age=30','X-Score-Source':'snapshot'}});}
}
