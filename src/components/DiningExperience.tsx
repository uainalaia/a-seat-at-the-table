import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { tableItems } from '../data/learning';
import type { DiningScene } from '../lib/dining-scene';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import TableObjectIcon from './TableObjectIcon';
import { tableLayout } from '../data/table-layout';
import { carrenoDiningLocators } from '../data/carreno';
import {useHydrated} from '../lib/use-hydrated';
gsap.registerPlugin(useGSAP);

// Offset the map labels so every piece remains touchable on a 320px screen.
const spots = [{x:410,y:470},{x:410,y:330},{x:140,y:320},{x:290,y:500},{x:530,y:500},{x:680,y:240},{x:160,y:140},{x:540,y:75},{x:220,y:420},{x:610,y:320},{x:240,y:210},{x:400,y:210},{x:340,y:110},{x:630,y:130},{x:760,y:140},{x:790,y:410},{x:655,y:485}];

function Arrow({back = false}:{back?: boolean}) {
  return <svg width="24" height="20" viewBox="0 0 24 20" fill="none" aria-hidden="true" style={back?{transform:'rotate(180deg)'}:undefined}><path d="M2 10h19M14 3l7 7-7 7" stroke="currentColor" strokeWidth="1.4" /></svg>;
}

function FlatSetting({selected,onSelect}:{selected:number;onSelect:(index:number,instant?:boolean)=>void}) {
  return <div className="flat-setting">
    <svg viewBox="0 0 880 650" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1" opacity=".3">{tableLayout.map((part,index)=><line key={index} x1={spots[index].x} y1={spots[index].y} x2={410+part.x*235} y2={330+part.z*235+(index===0?96:0)}/>)}</g>
      <g stroke="currentColor" strokeWidth="1.5">
        {tableLayout.map((part,index)=><g key={index} transform={`translate(${410+part.x*235} ${330+part.z*235}) rotate(${(part.angle??0)*180/Math.PI}) scale(${part.scale})`}>
          {part.kind==='plate'&&<><circle r="96" fill="#f7f2e8"/><circle r="87"/><circle r="67"/></>}
          {part.kind==='napkin'&&<><path d="M-28-45h56v90h-56z" fill="#e3d7c7"/><path d="m-28-45 56 90M-28 12h56"/></>}
          {part.kind==='fork'&&<path d="M-9-68v34q0 12 9 12v88M-3-68v34M3-68v34M9-68v34q0 12-9 12"/>}
          {part.kind==='knife'&&<path d={index===9?'M5 66V-70l-20 19v34H0v83Z':'M5 66V-68q-20 25-18 62H0v72Z'}/>}
          {part.kind==='spoon'&&<><ellipse cy="-42" rx="15" ry="24"/><path d="M0-18v84"/></>}
          {(part.kind==='water'||part.kind==='wine')&&<><circle r={part.kind==='wine'?24:25}/><circle r="18"/>{part.kind==='wine'&&<circle r="7"/>}</>}
          {part.kind==='cup'&&<><circle r="36"/><circle r="25"/><path d="M25-9q25 0 0 18"/></>}
        </g>)}
      </g>
    </svg>
    {tableItems.map((item,i)=><button type="button" key={item.id} className={`table-hotspot ${selected===i?'is-selected':''}`} style={{left:`${spots[i].x/8.8}%`,top:`${spots[i].y/6.5}%`}} aria-label={`Explore ${item.name.toLowerCase()}`} aria-pressed={selected===i} onClick={event=>onSelect(i,event.detail===0)}>{i+1}</button>)}
    <p>Your seat is here. Bread to the left. Water to the right.</p>
  </div>;
}

export default function DiningExperience({hero = false}:{hero?:boolean}) {
  const hydrated=useHydrated();
  const [entered,setEntered]=useState(!hero);
  const [selected,setSelected]=useState(0);
  const [mode,setMode]=useState<'3d'|'map'>('3d');
  const [ready,setReady]=useState(false);
  const [failed,setFailed]=useState(false);
  const [renderer,setRenderer]=useState<'loading'|'webgl'|'vector'>('loading');
  const [attempt,setAttempt]=useState(0);
  const [displayIssue,setDisplayIssue]=useState('');
  const [preferIllustrated,setPreferIllustrated]=useState(false);
  const [closeup,setCloseup]=useState(false);
  const host=useRef<HTMLDivElement>(null);
  const api=useRef<DiningScene|null>(null);
  const state=useRef({entered,selected,closeup}); state.current={entered,selected,closeup};
  const entryHeading=useRef<HTMLHeadingElement>(null);
  const details=useRef<HTMLDivElement>(null);
  const root=useRef<HTMLElement>(null);
  const current=tableItems[selected];
  useEffect(()=>{
    if(!hero)return;
    const explore=document.querySelector<HTMLAnchorElement>('.journey-nav a[href="/table/"]');
    if(entered)explore?.setAttribute('aria-current','step');else explore?.removeAttribute('aria-current');
  },[hero,entered]);
  useGSAP(()=>{
    if(hero&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      gsap.fromTo('.room-invitation h1',{y:16,opacity:0.8},{y:0,opacity:1,duration:0.7,ease:'expo.out',clearProps:'transform,opacity'});
    }
  },{scope:root});

  function choose(index:number,instant=false) {
    setSelected(index); setEntered(true); setCloseup(true);
    api.current?.select(index,instant);
    const url=new URL(window.location.href); url.hash=tableItems[index].id;
    window.history.replaceState(null,'',url);
  }
  useEffect(()=>{
    if(mode!=='3d'||!host.current)return;
    let disposed=false,tryingVector=false; let instance:DiningScene|undefined;
    setReady(false);setRenderer('loading');
    const onReady=()=>{
      if(disposed)return;
      setReady(true);
      if(state.current.entered){if(state.current.closeup)instance?.select(state.current.selected,true);else instance?.seat(true);}
    };
    const useVector=(reason:string)=>{
      if(disposed||tryingVector)return;
      tryingVector=true;instance?.dispose();instance=undefined;api.current=null;
      host.current?.replaceChildren();
      setReady(false);setDisplayIssue(reason);
      import('../lib/vector-dining-scene').then(({createVectorDiningScene})=>{
        if(disposed||!host.current)return;
        instance=createVectorDiningScene(host.current,{hero,onSelect:index=>choose(index),onReady,onUnavailable:()=>{}});
        api.current=instance;setRenderer('vector');
      }).catch(()=>{if(!disposed){setFailed(true);setMode('map');}});
    };
    if(preferIllustrated)useVector('Illustrated view selected.');
    else import('../lib/dining-scene').then(({createDiningScene})=>{
      if(disposed||!host.current)return;
      try {
        instance=createDiningScene(host.current,{hero,onSelect:index=>choose(index),onUnavailable:()=>useVector('The graphics context was interrupted.'),onReady});
        api.current=instance;setRenderer('webgl');
      } catch(error) {useVector(error instanceof Error?error.message:'The rendered view could not start.');}
    }).catch(()=>useVector('The rendered view could not load.'));
    return ()=>{disposed=true;instance?.dispose();api.current=null;};
  },[mode,hero,attempt,preferIllustrated]);
  useEffect(()=>{
    const id=window.location.hash.slice(1); const index=tableItems.findIndex(item=>item.id===id);
    if(index>=0) {setSelected(index);setEntered(true);setCloseup(true);}
  },[]);
  function takeSeat(instant=false) {
    if(root.current)root.current.dataset.instantEntry=String(instant);
    const enter=()=>{
      flushSync(()=>{setEntered(true);setCloseup(false);});
      api.current?.seat(instant);
      requestAnimationFrame(()=>entryHeading.current?.focus({preventScroll:true}));
    };
    if(hero&&!instant&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches&&document.startViewTransition){
      const transition=document.startViewTransition(enter);
      void transition.finished.catch(()=>{});
    }else enter();
  }
  function viewTable(instant=false) {
    setCloseup(false); api.current?.seat(instant);
    if(window.location.hash)window.history.replaceState(null,'',window.location.pathname+window.location.search);
  }
  return <section ref={root} className={`dining-experience ${hero?'dining-hero':'dining-lab'} ${entered?'is-seated':''} ${mode==='map'&&entered?'is-map':''}`} aria-label={hero?'Your invitation to the table':'Interactive dining room'} data-ready={ready} data-view={mode} data-renderer={mode==='map'?'map':renderer}>
    <div className="room-stage">
      {hero&&<div className="cinematic-veil" aria-hidden={entered}>
        <div className="cinematic-panel"><img src="/images/editorial-room.webp" srcSet="/images/editorial-room-800.webp 800w, /images/editorial-room.webp 1600w" sizes="(max-width:900px) 1600px, 100vw" alt="Illustrative candlelit dining salon with burgundy velvet seating and ivory linen." width="1600" height="900" fetchPriority="high"/></div>
        <div className="cinematic-panel"><img src="/images/editorial-room.webp" srcSet="/images/editorial-room-800.webp 800w, /images/editorial-room.webp 1600w" sizes="(max-width:900px) 1600px, 100vw" alt="" width="1600" height="900"/></div>
      </div>}
      <div ref={host} className={`room-canvas ${ready&&mode==='3d'?'is-ready':''}`} />
      {mode==='3d'&&!ready&&(!hero||entered)&&<div className="room-loading" role="status"><TableObjectIcon id="plate"/><span>Preparing your table…</span></div>}
      {mode==='map'&&entered&&<FlatSetting selected={selected} onSelect={choose}/>}
      <div className="room-shade" aria-hidden="true"/>
      {!entered&&<div className="room-invitation">
        <h1>A Seat at<br/><em>the Table.</em></h1>
        <p>Business dining, without the guesswork.<br/>An invitation for University of Arizona students.</p>
        <button type="button" className="room-enter" disabled={!hydrated} onClick={event=>takeSeat(event.detail===0)}>Take your seat<span><Arrow/></span></button>
        <a className="room-reading-link" href="/chapters/">Or begin with the chapters</a>
      </div>}
      {hero&&entered&&<h1 className="sr-only">A Seat at the Table</h1>}
      {entered&&<div className="room-orientation">
        <h2 ref={entryHeading} tabIndex={-1}>{closeup?current.name:'Your place. Your pace.'}</h2>
        <p>{closeup?'A closer look at a small, useful detail.':'Select an object, or choose one from the guide.'}</p>
      </div>}
      {entered&&mode==='3d'&&ready&&<div className="room-view-controls">
        <button type="button" aria-label="Explore dinner plate" onClick={event=>choose(0,event.detail===0)}>Your place setting<Arrow/></button>
        {closeup&&<button type="button" onClick={event=>viewTable(event.detail===0)}><Arrow back/>View the whole table</button>}
        <button type="button" onClick={event=>{setCloseup(false);api.current?.overview(event.detail===0);}}>View the room</button>
        <button type="button" className="room-mobile-details" onClick={()=>{details.current?.scrollIntoView({block:'start',behavior:'instant'});details.current?.focus({preventScroll:true});}}>Read the details<Arrow/></button>
      </div>}
      <div className="room-caption"><span>{mode==='3d'?(ready?'A table set for possibility.':'Preparing your table…'):'The place-setting map'}</span><span>{mode==='3d'?'An original interactive dining room':'From your seat’s perspective'}</span></div>
    </div>
    {entered&&<aside className="room-guide" aria-label="Table learning guide">
      <div ref={details} className="table-detail" tabIndex={-1} aria-live="polite" aria-atomic="true">
        <div className="object-study" aria-hidden="true"><TableObjectIcon id={current.id}/><span>{String(selected+1).padStart(2,'0')}<small> / {tableItems.length}</small></span></div>
        <h2>{current.name}</h2><p className="item-location">{current.position}</p><p>{current.explanation}</p>
        <div className="room-memory"><p><strong>At a glance</strong>{current.tip}</p></div>
        <p className="object-citation"><a href="/resources/#formal">Setting: Emily Post</a>{carrenoDiningLocators[current.id]&&<> · <a href="/resources/#carreno">Carreño · ch. V, art. III, section I, {carrenoDiningLocators[current.id]}</a></>}</p><a className="room-practice-link" href="/practice/">Try this at dinner<Arrow/></a>
        <button className="room-return-to-object" type="button" onClick={()=>{host.current?.scrollIntoView({block:"start",behavior:"instant"});entryHeading.current?.focus({preventScroll:true});}}>See this object<Arrow/></button>
      </div>
      <div className="object-pagination" role="group" aria-label="Explore the next table object"><button type="button" aria-label="Previous table object" disabled={!hydrated} onClick={event=>choose((selected+tableItems.length-1)%tableItems.length,event.detail===0)}><Arrow back/></button><span>{String(selected+1).padStart(2,'0')} / {tableItems.length}</span><button type="button" aria-label="Next table object" disabled={!hydrated} onClick={event=>choose((selected+1)%tableItems.length,event.detail===0)}><Arrow/></button></div>
      <div className="table-item-list" role="group" aria-label="Choose a table element">{tableItems.map((item,i)=><button key={item.id} type="button" disabled={!hydrated} aria-pressed={selected===i} className={selected===i?'active':''} onClick={event=>choose(i,event.detail===0)}><TableObjectIcon id={item.id}/><span className="item-name">{item.name}</span><svg className="item-arrow" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none"><path d="M3 13 13 3M3 3h10v10" stroke="currentColor"/></svg></button>)}</div>
      <div className="room-guide-footer">{mode==='3d'&&renderer==='webgl'&&<button type="button" onClick={()=>setPreferIllustrated(true)}>Use illustrated 3D</button>}{!failed&&<button type="button" onClick={()=>{setMode(mode==='3d'?'map':'3d');setCloseup(false);}}>{mode==='3d'?'Use the 2D map':'Return to the dining room'}</button>}{hero&&<a href="/table/">Open the full table guide<Arrow/></a>}</div>
      {(renderer==='vector'||failed)&&mode==='3d'&&<div className="room-recovery"><p role="status">Illustrated 3D is active. Explore all 17 objects with the guided camera.</p><button type="button" onClick={()=>{setPreferIllustrated(false);setFailed(false);setMode('3d');setAttempt(value=>value+1);}}>{preferIllustrated?'Use rendered 3D':'Retry rendered 3D'}</button><details><summary>Display details</summary><p>{displayIssue}</p></details></div>}
      {failed&&mode==='map'&&<div className="room-recovery"><p role="status">The room could not open. Every object remains available in the map.</p><button type="button" onClick={()=>{setFailed(false);setMode('3d');setAttempt(value=>value+1);}}>Retry 3D</button><details><summary>Display details</summary><p>{displayIssue}</p></details></div>}
    </aside>}
    {!entered&&<div className="invitation-bottom"><span>An invitation to feel at ease.</span><a href="#the-guide">Discover the guide<svg width="16" height="24" viewBox="0 0 16 24" fill="none" aria-hidden="true"><path d="M8 2v19M2 15l6 6 6-6" stroke="currentColor" strokeWidth="1.2"/></svg></a></div>}
    <noscript><p className="room-noscript">Explore the <a href="/table/#complete-guide">complete table guide</a> or <a href="/chapters/">read the chapters</a>. The interactive dining room requires JavaScript.</p></noscript>
  </section>;
}
