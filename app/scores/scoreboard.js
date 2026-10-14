'use client';
import {useEffect,useState} from 'react';
export default function Scoreboard({initial}){
 const [scores,setScores]=useState(initial);const [tab,setTab]=useState('completed');
 useEffect(()=>{const controller=new AbortController();const update=async()=>{try{const r=await fetch('/api/scores',{signal:controller.signal});if(r.ok)setScores(await r.json());}catch{}};update();const timer=setInterval(update,30000);return()=>{controller.abort();clearInterval(timer);};},[]);
 return <div id="body-content"><div className="main-body" style={{border:'5px solid #214252',background:'#214252',color:'#444'}}>
  <div className="content" style={{background:'#fff'}}><div className="content-tabs" style={{background:'#214252'}}><ul className="tabs" role="tablist" aria-label="Cricket match schedule">
   {[['completed','RECENT'],['live','LIVE'],['upcoming','UPCOMING']].map(([key,label])=><li key={key} className={'df-btn'+(tab===key?' active':'')} id={key} style={{background:tab===key?'#fff':'#214252'}}><button className="wtab" role="tab" aria-selected={tab===key} onClick={()=>setTab(key)} style={{color:tab===key?'#222':'#fff'}}>{label}</button></li>)}
  </ul></div><div className="active-layer" style={{background:'#214252'}}/><div id="content" role="tabpanel">
   {(scores[tab]||[]).map((match,i)=><article className="seperate-v" key={match.id||i}><div className="home-sc-body"><a style={{background:'#eee',color:'#444'}} className="link-series" target="_blank" rel="noopener noreferrer" href="/out">
    <div className="status-bar"><span className="series_">{match.spec}<span>, {match.series}</span></span></div>
    <h4 className="teams"><div className="vs-team"><span className="team-vs">{match.t_one}</span><span className="vs_"> vs </span><span className="team-vs">{match.t_two}</span></div></h4>
    {match.status!=='UPCOMING'&&<h4 className="sc-h2"><div className="vs-team"><span className="team-vs team-score">{match.t_one_s}</span><span className="vs_">&nbsp;</span><span className="team-vs team-score">{match.t_two_s}</span></div></h4>}
    <div className="status-bar sc-time">{match.status==='UPCOMING'?match.dt:match.m_status}</div>
    <div className="status-bar"><div className={'live w3-button w3-round w3-tiny '+(match.status==='LIVE'?'w3-red':'w3-dark')}><span className="btn live">{match.status==='LIVE'?'LIVE':'DETAILS'}</span></div></div>
   </a></div></article>)}
  </div></div><div className="footer-links"><a className="w3-button w3-dark w3-round w3-tiny w3-hover-blue" href="/out" target="_blank" rel="noopener noreferrer" title="Crictimes">CRICTIMES</a>{' '}<a className="live w3-button w3-red w3-round w3-tiny w3-hover-blue" href="/out" target="_blank" rel="noopener noreferrer" title="Add this widget to your website">EMBED</a></div>
 </div></div>;
}
