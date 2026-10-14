'use client';
import {useEffect,useRef} from 'react';
export default function Replica({page}){
 const root=useRef(null);
 useEffect(()=>{
  document.body.className=page.bodyClass;
  const resize=()=>{document.documentElement.style.setProperty('--app-height',`${innerHeight}px`);document.documentElement.style.setProperty('--header-height',`${root.current.querySelector('header')?.offsetHeight||70}px`);};
  const scroll=()=>document.body.classList.toggle('is-header-sticky',scrollY>100);
  resize();scroll();addEventListener('resize',resize);addEventListener('scroll',scroll);
  root.current.querySelector('details')?.setAttribute('open','');
  let disposed=false;const carousels=[];
  const initCarousels=()=>{if(disposed)return;root.current.querySelectorAll('.grr-swiper-activation').forEach(el=>{
   const controls=el.closest('.style-carousel').querySelector('.swiper-button-container');
   const swiper=new window.Swiper(el,{speed:400,spaceBetween:20,centeredSlides:false,grabCursor:true,loop:true,slidesPerView:1.2,autoHeight:false,breakpointsBase:'container',autoplay:matchMedia('(prefers-reduced-motion: reduce)').matches?false:{delay:3000,disableOnInteraction:false},breakpoints:{1024:{slidesPerView:3},768:{slidesPerView:2},479:{slidesPerView:1.2},200:{slidesPerView:1.2}},pagination:{el:el.querySelector('.swiper-pagination'),type:'bullets',clickable:true},keyboard:{enabled:true,onlyInViewport:false},navigation:{nextEl:controls?.querySelector('.swiper-button-next'),prevEl:controls?.querySelector('.swiper-button-prev')},observer:true,observeParents:true,observeSlideChildren:true});
   const pause=()=>swiper.autoplay?.stop(),resume=()=>swiper.autoplay?.start();el.addEventListener('mouseenter',pause);el.addEventListener('mouseleave',resume);carousels.push({swiper,el,pause,resume});
  });};
  if(root.current.querySelector('.grr-swiper-activation')){if(window.Swiper)initCarousels();else{let script=document.querySelector('script[data-local-swiper]');if(!script){script=document.createElement('script');script.src='/vendor/swiper.min.js';script.dataset.localSwiper='true';document.head.append(script);}script.addEventListener('load',initCarousels,{once:true});}}
  const onClick=e=>{
   const target=e.target.closest('button,a,summary,.nav-overlay,.swiper-button-next,.swiper-button-prev');if(!target)return;
   if(target.matches('.navigation-toggler')){const open=document.body.classList.toggle('is-nav-open');root.current.querySelectorAll('.navigation-toggler').forEach(b=>b.setAttribute('aria-expanded',String(open)));}
   if(target.matches('.nav-overlay,nav a'))document.body.classList.remove('is-nav-open');
   if(target.matches('summary'))root.current.querySelectorAll('details').forEach(d=>{if(d!==target.parentElement)d.removeAttribute('open');});
  };
  const submit=e=>{e.preventDefault();window.location.assign('/out');};
  const key=e=>{if(e.key==='Escape')document.body.classList.remove('is-nav-open');};
  const node=root.current;node.addEventListener('click',onClick);node.addEventListener('submit',submit);addEventListener('keydown',key);
  return()=>{disposed=true;carousels.forEach(({swiper,el,pause,resume})=>{el.removeEventListener('mouseenter',pause);el.removeEventListener('mouseleave',resume);swiper.destroy(true,true);});removeEventListener('resize',resize);removeEventListener('scroll',scroll);removeEventListener('keydown',key);node.removeEventListener('click',onClick);node.removeEventListener('submit',submit);};
 },[page]);
 return <div ref={root} dangerouslySetInnerHTML={{__html:page.body}}/>;
}
