import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { fallbackGallery } from '../data/fallback';
import Lightbox from '../components/Lightbox';

export default function Gallery(){
  const [images,setImages]=useState(fallbackGallery);
  const [expanded,setExpanded]=useState(false);
  const [lightbox,setLightbox]=useState(-1);
  useEffect(()=>{api.get('/gallery').then(({data})=>{setImages(data.images || [])}).catch(()=>{})},[]);
  const first = images.slice(0,4);
  const fifth = images[4];
  const rest = images.slice(5);
  return <main>
    <section className="page-hero"><img src="/assets/photos/terrace.webp" alt="Lily gallery"/><div className="container page-hero-inner"><div className="eyebrow">Gallery</div><h1 className="display h1">Moments at Lily.</h1><p>A simple collection of the food, spaces and evenings that make Lily feel like Lily.</p></div></section>
    <section className="section gallery-page-section"><div className="container"><div className="gallery-preview-board reveal">
      {first.map((img,i)=><button key={img._id || i} type="button" className={`gallery-preview-item lightbox-trigger ${i===0?'gallery-preview-main':''}`} onClick={()=>setLightbox(i)}><img src={img.url} alt={img.alt}/></button>)}
      {fifth && <button type="button" className="gallery-reveal-card" aria-expanded={expanded} onClick={()=>{if(!expanded)setExpanded(true); else setLightbox(4)}}><img src={fifth.url} alt={fifth.alt}/><span><strong>{expanded ? 'View' : `+${Math.max(images.length-5,0)}`}</strong><small>{expanded ? 'Open photo' : 'View all photos'}</small></span></button>}
    </div>
    {expanded && <div className="gallery-extra-grid is-visible">{[fifth,...rest].filter(Boolean).map((img,i)=><button type="button" className="gallery-item lightbox-trigger" key={img._id || i} onClick={()=>setLightbox(i+4)}><img src={img.url} alt={img.alt}/></button>)}</div>}
    </div></section>
    <Lightbox images={images} index={lightbox} onClose={()=>setLightbox(-1)} onIndexChange={setLightbox}/>
  </main>
}
