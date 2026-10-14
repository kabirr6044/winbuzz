import './globals.css';
export const metadata={
 icons:{
  icon:[
   {url:'/assets/favicon.png',sizes:'32x32',type:'image/png'},
   {url:'/assets/favicon.png',sizes:'192x192',type:'image/png'},
  ],
  apple:[{url:'/assets/favicon.png'}],
 },
 other:{'msapplication-TileImage':'/assets/favicon.png'},
};
export default function RootLayout({children}){return <html lang="en-US"><body>{children}</body></html>}
