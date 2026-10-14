import {NextResponse} from 'next/server';
function destination(){const value=process.env.EXTERNAL_REDIRECT_URL||'https://example.com';try{const url=new URL(value);if(!['http:','https:'].includes(url.protocol))throw Error();return url;}catch{return new URL('https://example.com');}}
export function GET(){return NextResponse.redirect(destination(),303);}
export function POST(){return NextResponse.redirect(destination(),303);}
