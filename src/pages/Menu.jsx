import { useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../api/client';
import { fallbackMenu } from '../data/fallback';

function MenuPage({ page, index, className = '', onAnimationEnd }) {
  if (page.cover) {
    return <div className={`book-page menu-cover-page ${className}`} onAnimationEnd={onAnimationEnd}>
      <div className="menu-cover-brand"><span className="menu-cover-logo"><img src="/assets/lily-logo.jpg" alt="Lily"/></span><div className="menu-cover-name">Lily</div><div className="menu-cover-sub">Cafe & Restaurant</div><div className="menu-cover-rule"></div><div className="menu-cover-title">The Menu</div><div className="menu-cover-quote">&ldquo;A cozy place for food &amp; privacy&rdquo;</div><div className="menu-cover-hint">Click page or arrow <span>→</span></div></div>
    </div>;
  }
  const items = (page.items || []).filter(item => item.isAvailable !== false).sort((a,b)=>(a.sortOrder||0)-(b.sortOrder||0));
  return <div className={`book-page ${className}`} onAnimationEnd={onAnimationEnd}>
    <div className="book-title-row"><span className="book-mini-logo"><img src="/assets/lily-logo.jpg" alt=""/></span><div><h2 className="book-title">{page.title}</h2><div className="book-sub">{page.subtitle}</div></div></div>
    <div className="menu-list">{items.map((item,i)=><div className="menu-row" key={item._id || `${item.name}-${i}`}><span>{item.name}</span><span className="price">{item.price}</span></div>)}</div><div className="menu-page-num">&mdash; page {index} &mdash;</div>
  </div>;
}

export default function Menu(){
  const [categories,setCategories]=useState(fallbackMenu);
  const [index,setIndex]=useState(0);
  const [turn,setTurn]=useState(null);
  const touchStart=useRef(null);
  useEffect(()=>{api.get('/menu').then(({data})=>{setCategories(data.categories || [])}).catch(()=>{})},[]);
  const pages = useMemo(()=>[{cover:true},...categories.filter(c=>c.isActive!==false).sort((a,b)=>(a.sortOrder||0)-(b.sortOrder||0))],[categories]);

  const go=(dir)=>{
    if(turn)return;
    const next=index+dir;
    if(next<0||next>=pages.length)return;
    setTurn({from:index,to:next,dir});
  };
  const finish=()=>{if(!turn)return;setIndex(turn.to);setTurn(null)};
  useEffect(()=>{
    const key=(e)=>{if(e.key==='ArrowRight')go(1);if(e.key==='ArrowLeft')go(-1)};
    window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);
  },[index,turn,pages.length]);

  const renderLayers=()=>{
    if(!turn)return <MenuPage page={pages[index]} index={index} className="current"/>;
    if(turn.dir>0)return <><MenuPage page={pages[turn.to]} index={turn.to} className="next-layer"/><MenuPage page={pages[turn.from]} index={turn.from} className="current turn-next" onAnimationEnd={finish}/></>;
    return <><MenuPage page={pages[turn.from]} index={turn.from} className="current"/><MenuPage page={pages[turn.to]} index={turn.to} className="current turn-prev" onAnimationEnd={finish}/></>;
  };

  const pageClick=(e)=>{if(e.target.closest('.book-control'))return;const r=e.currentTarget.getBoundingClientRect();go(e.clientX-r.left>r.width/2?1:-1)};
  return <main className="menu-scene menu-scene-v3"><section className="menu-intro" aria-labelledby="menu-title"><div className="menu-script">Our Menu</div><h1 id="menu-title" className="display">Flip through<br/>our kitchen.</h1><p>Take your time with the menu. Click the right side of the book to move forward, the left side to go back - or use the arrows.</p></section><div className="book-wrap book-wrap-v3"><div className="book-cover book-cover-v3" onTouchStart={e=>touchStart.current=e.changedTouches[0].clientX} onTouchEnd={e=>{if(touchStart.current==null)return;const dx=e.changedTouches[0].clientX-touchStart.current;if(Math.abs(dx)>45)go(dx<0?1:-1);touchStart.current=null}}><div className="book-pages" aria-live="polite" onClick={pageClick}>{renderLayers()}</div><button className="book-control prev" aria-label="Previous page" disabled={index===0||Boolean(turn)} onClick={()=>go(-1)}>‹</button><button className="book-control next" aria-label="Next page" disabled={index===pages.length-1||Boolean(turn)} onClick={()=>go(1)}>›</button></div></div></main>
}
